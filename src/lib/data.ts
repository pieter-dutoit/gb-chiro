import 'server-only';
import { getPayload, type CollectionSlug, type GlobalSlug } from 'payload';
import { unstable_cache } from 'next/cache';
import config from '@payload-config';
import * as map from './cms-mappers';

const options = { tags: ['payload-public'], revalidate: false as const };
// Never bind a request/user to this cache: public queries always run anonymously.
const global = <T extends GlobalSlug>(slug: T) => unstable_cache(async () => {
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug, depth: 3, draft: false, overrideAccess: false });
}, ['global', slug], options);
const collection = <T extends CollectionSlug>(slug: T) => unstable_cache(async () => {
  const payload = await getPayload({ config });
  return (await payload.find({ collection: slug, depth: 2, draft: false, overrideAccess: false,
    where: { _status: { equals: 'published' } }, pagination: false, sort: 'id' })).docs;
}, ['collection', slug], options);

const graphics = global('graphics');
const business = global('business-details');
const home = global('home-page');
const about = global('about-us-page');
const what = global('what-to-expect-page');
const treatment = global('treatment-and-care-page');
const contact = global('contact-us-page');
const services = collection('services');
const articles = collection('articles');
const socials = collection('social-media-platforms');
const reviews = collection('reviews');

export async function getGraphics() {
  const doc = await graphics();
  return { ...doc, logo: map.requiredMedia(doc.logo), horizontalLogo: map.requiredMedia(doc.horizontalLogo), backgroundGraphic: map.requiredMedia(doc.backgroundGraphic) };
}
export async function getBusinessDetails() { return map.business(await business()); }
export async function getHomePageData() {
  const doc = await home();
  return { ...doc, landingImage: map.requiredMedia(doc.landingImage), whatToExpectImage: map.requiredMedia(doc.whatToExpectImage), seo: map.seo(doc.seo) };
}
export async function getAboutUsPageData() {
  const doc = await about();
  return { ...doc, welcomeImage: map.requiredMedia(doc.welcomeImage), meetTheChiroImage: map.requiredMedia(doc.meetTheChiroImage), practiceImages: doc.practiceImages.map(map.requiredMedia), seo: map.seo(doc.seo) };
}
export async function getWhatToExpectPageData() {
  const doc = await what();
  return { ...doc, steps: (doc.steps ?? []).filter(map.populated).filter(map.published).map(map.step), seo: map.seo(doc.seo) };
}
export async function getTreatmentAndCareData() {
  const doc = await treatment();
  return { ...doc, services: (doc.services ?? []).filter(map.populated).filter(map.published).map(map.service), seo: map.seo(doc.seo) };
}
export async function getContactUsPageData() {
  const doc = await contact(); return { ...doc, seo: map.seo(doc.seo) };
}
export async function getServices() { return (await services()).map(map.service); }
export async function getServicesWithArticles() { return (await getServices()).filter(service => service.article); }
export async function getArticles() { return (await articles()).map(map.article); }
export async function getArticle(slug: string) { return (await getArticles()).find(article => article.slug === slug); }
export async function getSocials() { return socials(); }
export async function getReviews() { return reviews(); }
