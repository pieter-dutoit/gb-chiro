import './env';
import fs from 'node:fs';
import path from 'node:path';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'node:crypto';
import type { CollectionSlug, RequiredDataFromCollectionSlug, GlobalSlug, DataFromGlobalSlug } from 'payload';
import { seed, sourceFile, paragraphs, articleBody, exportedImages } from './lib/seed';
import type { SiteMedia, SiteSEO } from '../src/lib/seed-types';

const media = new Map(Object.values(seed.media).map(image => [image.id, image as SiteMedia]));
const seoMedia = new Map(Object.values(seed.seoMedia).map(image => [image.id, image as SiteMedia]));
const warnings: string[] = [];
for (const extra of exportedImages()) {
  const map = extra.collection === 'media' ? media : seoMedia;
  if (!map.has(extra.image.id)) {
    try { sourceFile(extra.image, extra.collection === 'seo-media'); map.set(extra.image.id, extra.image); }
    catch { warnings.push(`Unavailable unused archive image: ${extra.collection}/${extra.image.filename}`); }
  }
}
const sources = [...[...media.values()].map(image => ({ collection: 'media' as const, image })), ...[...seoMedia.values()].map(image => ({ collection: 'seo-media' as const, image }))].map(item => ({ ...item, file: sourceFile(item.image, item.collection === 'seo-media') }));
console.log(`Preflight: ${sources.length} media files, ${seed.articles.length} article, ${seed.services.length} services, ${seed.whatToExpectPageData.steps.length} patient steps.`);
for (const warning of warnings) console.warn(warning);
if (process.argv.includes('--dry-run')) process.exit(0);
const { getPayload } = await import('payload');
const { default: config } = await import('../src/payload.config');
const payload = await getPayload({ config });
const importContext = () => ({ skipRevalidation: true, importing: true });
const storage = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION || 'auto', credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! } });
async function stored(key: string) {
  try { await storage.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key })); return true; }
  catch (error) { if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) return false; throw error; }
}
const maps = new Map<string, number>();
const manifest: Record<string, unknown> = {};
const target = createHash('sha256').update(`${process.env.DATABASE_URL}|${process.env.CMS_DB_SCHEMA}|${process.env.S3_PREFIX}`).digest('hex').slice(0, 16);
fs.mkdirSync('.cms-import', { recursive: true });
const manifestPath = `.cms-import/${target}.json`;
if (fs.existsSync(manifestPath)) Object.assign(manifest, JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
function record(key: string, value: unknown) { manifest[key] = value; fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n'); }

async function ensure(collection: CollectionSlug, oldID: number, data: Record<string, unknown>, filePath?: string) {
  const sourceID = `legacy:${collection}:${oldID}`;
  const existing = await payload.find({ collection, where: { sourceID: { equals: sourceID } }, depth: 0, limit: 1, overrideAccess: true, draft: true });
  let doc = existing.docs[0] ?? await payload.create({ collection, data: { ...data, sourceID } as RequiredDataFromCollectionSlug<CollectionSlug>, filePath, overrideAccess: true, context: importContext() });
  if (filePath) {
    const image = doc as unknown as { filename: string; prefix: string; _objectKey?: string; sizes?: Record<string, { filename?: string | null }> };
    const files = [image.filename, ...Object.values(image.sizes ?? {}).map(size => size.filename).filter((name): name is string => Boolean(name))];
    let missing = false;
    for (const filename of files) if (!await stored([image.prefix, image._objectKey, filename].filter(Boolean).join('/'))) missing = true;
    if (missing) {
      if (!existing.docs[0]) throw new Error(`Upload was not persisted: ${collection}/${oldID}`);
      if (!image.prefix.startsWith(`${process.env.S3_PREFIX}/`) || image._objectKey || image.filename !== path.basename(filePath)) throw new Error(`Missing media changed since import; repair manually: ${collection}/${oldID}`);
      doc = await payload.update({ collection, id: doc.id, data: {}, filePath, overrideAccess: true, context: importContext() });
      console.log(`${collection}: repaired incomplete upload ${oldID}`);
      const repaired = doc as unknown as { prefix: string; _objectKey?: string; filename: string };
      if (!await stored([repaired.prefix, repaired._objectKey, repaired.filename].filter(Boolean).join('/'))) throw new Error(`Repair failed: ${collection}/${oldID}`);
    }
  }
  maps.set(`${collection}:${oldID}`, Number(doc.id));
  record(sourceID, { id: doc.id, status: existing.docs[0] ? 'existing' : 'created' });
  console.log(`${collection}: ${oldID} → ${doc.id} (${existing.docs[0] ? 'kept' : 'created'})`);
  return Number(doc.id);
}
const mapped = (collection: string, id: number) => {
  const value = maps.get(`${collection}:${id}`);
  if (!value) throw new Error(`Unresolved relationship ${collection}:${id}`);
  return value;
};
const seo = (data: SiteSEO) => ({ meta: data.meta, open_graph: {
  site_name: data.openGraph.siteName, title: data.openGraph.title, description: data.openGraph.description,
  image: data.openGraph.image.map(image => mapped('seo-media', image.id)),
} });
async function global(slug: GlobalSlug, marker: string, data: Record<string, unknown>) {
  const existing = await payload.findGlobal({ slug, depth: 0, draft: true, overrideAccess: true });
  // Never overwrite an editor's published OR draft global on rerun.
  void marker;
  if (existing.createdAt) { console.log(`${slug}: kept`); return; }
  await payload.updateGlobal({ slug, data: { ...data, _status: 'published' } as DataFromGlobalSlug<GlobalSlug>, overrideAccess: true, context: importContext() });
  record(slug, { status: 'created' });
}
try {
  for (const item of sources) await ensure(item.collection, item.image.id, { alt: item.image.alt }, item.file);
  for (const item of seed.articles) await ensure('articles', item.id, {
    slug: item.slug, title: item.title, author: item.author,
    thumbnail: item.thumbnail ? mapped('media', item.thumbnail.id) : undefined,
    body: articleBody(mapped('media', seed.articleImages.newPatients.id)),
    summary: item.description, keywords: item.tags?.map(value => ({ value })),
    createdAt: item.createdAt, updatedAt: item.updatedAt, _status: 'published',
  });
  for (const item of seed.services) await ensure('services', item.id, {
    name: item.name, description: item.description, thumbnail: mapped('media', item.thumbnail.id),
    article: item.article ? mapped('articles', item.article.id) : undefined, _status: 'published',
  });
  for (const item of seed.whatToExpectPageData.steps) await ensure('new-patient-steps', item.id, {
    icon: mapped('media', item.icon.id), title: paragraphs([item.title], true), overview: item.overview,
    description: paragraphs(item.description), _status: 'published',
  });
  for (const item of seed.socials) await ensure('social-media-platforms', item.id, { name: item.name, link: item.link, _status: 'published' });
  for (const item of seed.reviews) await ensure('reviews', item.id, { name: item.name, text: item.text, platform: item.platform, link: item.link, _status: 'published' });
  const { bookingLink, email, phone, address, operatingHours } = seed.businessDetails;
  const business = { bookingLink, email, phone, address, operatingHours };
  await global('business-details', 'bookingLink', business);
  await global('graphics', 'logo', Object.fromEntries(['logo', 'horizontalLogo', 'backgroundGraphic'].map(key => [key, mapped('media', seed.graphics[key as 'logo'].id)])));
  await global('home-page', 'landingImage', { landingImage: mapped('media', seed.homePageData.landingImage.id), whatToExpectImage: mapped('media', seed.homePageData.whatToExpectImage.id), seo: seo(seed.homePageData.seo) });
  await global('about-us-page', 'welcomeImage', {
    welcomeImage: mapped('media', seed.aboutUsPageData.welcomeImage.id), meetTheChiroImage: mapped('media', seed.aboutUsPageData.meetTheChiroImage.id),
    practiceImages: seed.aboutUsPageData.practiceImages.map(image => mapped('media', image.id)), seo: seo(seed.aboutUsPageData.seo),
  });
  await global('treatment-and-care-page', 'services', { services: seed.treatmentAndCarePageData.services.map(item => mapped('services', item.id)), seo: seo(seed.treatmentAndCarePageData.seo) });
  await global('what-to-expect-page', 'steps', { steps: seed.whatToExpectPageData.steps.map(item => mapped('new-patient-steps', item.id)), seo: seo(seed.whatToExpectPageData.seo) });
  await global('contact-us-page', 'seo.meta.title', { seo: seo(seed.contactUsPageData.seo) });
  console.log('Import complete. Existing records were not overwritten. Restart the local app to clear pre-import caches.');
} finally { storage.destroy(); await payload.destroy(); }
// Payload plugins may retain telemetry/upload keep-alive handles after destroy.
process.exit(0);
