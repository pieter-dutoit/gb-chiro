import './env';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { paragraphs } from './lib/seed';
import { verifyStoredMedia } from './lib/verify-media';

const db = new URL(process.env.DATABASE_URL!);
if (!['localhost', '127.0.0.1'].includes(db.hostname) || !process.env.CMS_DB_SCHEMA?.startsWith('payload_')) {
  throw new Error('Integration tests are restricted to an isolated local database.');
}
const { getPayload } = await import('payload');
const { default: config } = await import('../src/payload.config');
const payload = await getPayload({ config });
const context = { skipRevalidation: true };
const suffix = randomBytes(8).toString('hex');
const cleanup: (() => Promise<unknown>)[] = [];
try {
  const admin = await payload.create({ collection: 'users', data: { email: `admin-${suffix}@example.test`, password: randomBytes(24).toString('hex'), roles: ['admin'] }, context: { bootstrap: true }, overrideAccess: true });
  cleanup.push(() => payload.delete({ collection: 'users', id: admin.id, overrideAccess: true }));
  const editor = await payload.create({ collection: 'users', data: { email: `editor-${suffix}@example.test`, password: randomBytes(24).toString('hex'), roles: ['editor'] }, user: admin, overrideAccess: false });
  cleanup.push(() => payload.delete({ collection: 'users', id: editor.id, overrideAccess: true }));
  await assert.rejects(payload.create({ collection: 'users', data: { email: `forbidden-${suffix}@example.test`, password: randomBytes(24).toString('hex') }, user: editor, overrideAccess: false }));
  await payload.update({ collection: 'users', id: editor.id, data: { roles: ['admin'] }, user: editor, overrideAccess: false });
  assert.deepEqual((await payload.findByID({ collection: 'users', id: editor.id, overrideAccess: true })).roles, ['editor']);
  await assert.rejects(payload.findByID({ collection: 'users', id: admin.id, user: editor, overrideAccess: false }));
  await assert.rejects(payload.create({ collection: 'reviews', data: { name: 'Anonymous', text: 'Not allowed' }, overrideAccess: false, context }));
  console.log('PASS: user management, editor self-access, role protection, anonymous writes.');

  const draft = await payload.create({ collection: 'articles', data: { title: `Verification ${suffix}`, author: 'Test author', body: paragraphs(['Original published copy']), _status: 'draft' }, user: editor, overrideAccess: false, context });
  cleanup.push(() => payload.delete({ collection: 'articles', id: draft.id, context, overrideAccess: true }));
  const anonymous = () => payload.find({ collection: 'articles', where: { id: { equals: draft.id } }, overrideAccess: false, draft: false });
  assert.equal((await anonymous()).totalDocs, 0);
  await payload.update({ collection: 'articles', id: draft.id, data: { _status: 'published' }, user: editor, overrideAccess: false, context });
  assert.equal((await anonymous()).totalDocs, 1);
  await payload.update({ collection: 'articles', id: draft.id, data: { body: paragraphs(['Unpublished new copy']), _status: 'draft' }, draft: true, user: editor, overrideAccess: false, context });
  assert.ok(JSON.stringify((await anonymous()).docs[0].body).includes('Original published copy'));
  await payload.update({ collection: 'articles', id: draft.id, data: { _status: 'published' }, user: editor, overrideAccess: false, context });
  assert.ok(JSON.stringify((await anonymous()).docs[0].body).includes('Unpublished new copy'));
  await payload.update({ collection: 'articles', id: draft.id, data: { _status: 'draft' }, draft: false, user: editor, overrideAccess: false, context });
  assert.equal((await anonymous()).totalDocs, 0);
  console.log('PASS: draft, publish, draft editing, republish and unpublish.');

  const social = await payload.create({ collection: 'social-media-platforms', data: { name: 'linkedin', link: 'https://www.linkedin.com/company/example', _status: 'published' }, user: editor, overrideAccess: false, context });
  cleanup.push(() => payload.delete({ collection: 'social-media-platforms', id: social.id, context, overrideAccess: true }));
  assert.equal((await payload.findByID({ collection: 'social-media-platforms', id: social.id, overrideAccess: false })).name, 'linkedin');
  const business = await payload.findGlobal({ slug: 'business-details', depth: 0, overrideAccess: true });
  await assert.rejects(payload.updateGlobal({ slug: 'business-details', data: { operatingHours: [business.operatingHours[0], business.operatingHours[0]] }, user: editor, overrideAccess: false, context }));
  await assert.rejects(payload.updateGlobal({ slug: 'business-details', data: { operatingHours: [{ ...business.operatingHours[0], opens: '27:80' }] }, user: editor, overrideAccess: false, context }));
  console.log('PASS: additional social platforms and operating-hours validation.');

  const images = await payload.find({ collection: 'media', limit: 100, overrideAccess: false });
  const seo = await payload.find({ collection: 'seo-media', limit: 100, overrideAccess: false });
  assert.equal(images.totalDocs, 28); assert.equal(seo.totalDocs, 10);
  assert.ok(images.docs.every(image => image.url && image.alt));
  assert.ok(seo.docs.every(image => image.width === 1200 && image.height === 630));
  const about = await payload.findGlobal({ slug: 'about-us-page', depth: 1, overrideAccess: false, draft: false });
  assert.equal(about.practiceImages.length, 4);
  assert.ok(about.practiceImages.every(image => typeof image === 'object'));
  const steps = await payload.findGlobal({ slug: 'what-to-expect-page', depth: 1, overrideAccess: false });
  assert.equal(steps.steps?.length, 3);
  console.log('PASS: imported media, SEO dimensions, gallery and patient-step relationships.');
  if (process.argv.includes('--storage')) console.log(`PASS: ${await verifyStoredMedia(payload)} R2 objects and all public source URLs.`);
} finally {
  for (const remove of cleanup.reverse()) await remove();
  await payload.destroy();
}
process.exit(0);
