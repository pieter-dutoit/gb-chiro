import '../scripts/env';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Field, TextField } from 'payload';
import { HomePage } from '../src/cms-config/globals/home-page';
import { AboutUsPage } from '../src/cms-config/globals/about-us-page';
import { BusinessDetailsGlobal } from '../src/cms-config/globals/business-details';
import { Graphics } from '../src/cms-config/globals/graphics';
import { TreatmentAndCarePage } from '../src/cms-config/globals/treatment-and-care-page';
import { WhatToExpectPage } from '../src/cms-config/globals/what-to-expect-page';
import { ContactUsPage } from '../src/cms-config/globals/contact-us-page';
import { Article } from '../src/cms-config/collections/articles';
import { Services } from '../src/cms-config/collections/services';
import { Reviews } from '../src/cms-config/collections/reviews';
import { SocialMediaPlatforms } from '../src/cms-config/collections/social-media-platforms';
import { NewPatientSteps } from '../src/cms-config/collections/new-patient-steps';
import { Users } from '../src/cms-config/collections/users';
import { Media } from '../src/cms-config/collections/media';
import { SEOMedia } from '../src/cms-config/collections/seo-media';
import { articleBody, paragraphs, seed, sourceFile } from '../scripts/lib/seed';

function fields(list: Field[], prefix = ''): Record<string, Field> {
  const result: Record<string, Field> = {};
  for (const field of list) {
    const name = 'name' in field ? `${prefix}${field.name}` : prefix.replace(/\.$/, '');
    if ('name' in field) result[name] = field;
    if ('fields' in field) Object.assign(result, fields(field.fields, name ? `${name}.` : ''));
    if (field.type === 'tabs') for (const tab of field.tabs) Object.assign(result, fields(tab.fields, 'name' in tab ? `${prefix}${tab.name}.` : prefix));
  }
  return result;
}
const configs = [HomePage, AboutUsPage, BusinessDetailsGlobal, Graphics, TreatmentAndCarePage, WhatToExpectPage, ContactUsPage, Article, Services, Reviews, SocialMediaPlatforms, NewPatientSteps, Users, Media, SEOMedia];
// Acceptance contract recovered from the removed CMS, including fields that the
// static conversion narrowed or omitted. Additional internal fields are allowed.
const contract: Record<string, Record<string, string>> = {
  'business-details': { bookingLink: 'text', email: 'email', phone: 'text', 'address.street': 'text', 'address.suburb': 'text', 'address.state': 'select', 'address.code': 'text', 'address.mapsLink': 'text', 'address.coords': 'point', operatingHours: 'array', 'operatingHours.opens': 'text', 'operatingHours.closes': 'text', 'operatingHours.note': 'text', ...Object.fromEntries(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => [`operatingHours.${day}`, 'checkbox'])) },
  graphics: { logo: 'upload', horizontalLogo: 'upload', backgroundGraphic: 'upload' },
  'home-page': { landingImage: 'upload', whatToExpectImage: 'upload' },
  'about-us-page': { welcomeImage: 'upload', meetTheChiroImage: 'upload', practiceImages: 'upload' },
  'treatment-and-care-page': { services: 'relationship' },
  'what-to-expect-page': { steps: 'relationship' },
  'contact-us-page': {},
  articles: { slug: 'text', author: 'text', thumbnail: 'upload', title: 'text', body: 'richText' },
  services: { thumbnail: 'upload', name: 'text', description: 'text', article: 'relationship' },
  'new-patient-steps': { icon: 'upload', title: 'richText', overview: 'text', description: 'richText' },
  reviews: { name: 'text', text: 'textarea', platform: 'select', link: 'text' },
  'social-media-platforms': { name: 'select', link: 'text' },
  media: { alt: 'text' }, 'seo-media': { alt: 'text' }, users: { roles: 'select' },
};
for (const config of configs) test(`Editor field parity: ${config.slug}`, () => {
  const expected = { ...contract[config.slug] };
  if (['home-page','about-us-page','treatment-and-care-page','what-to-expect-page','contact-us-page'].includes(config.slug)) Object.assign(expected, {
    'seo.meta.title': 'text', 'seo.meta.description': 'textarea', 'seo.open_graph.site_name': 'text', 'seo.open_graph.title': 'text', 'seo.open_graph.description': 'textarea', 'seo.open_graph.image': 'upload', 'seo.twitter.creator': 'text', 'seo.twitter.creatorId': 'text',
  });
  const actual = fields(config.fields);
  for (const [name, type] of Object.entries(expected)) assert.equal(actual[name]?.type, type, name);
});
test('All original social options and relationship multiplicities survive', () => {
  const social = fields(SocialMediaPlatforms.fields).name;
  assert.equal(social.type === 'select' && social.options.length, 13);
  for (const [config, field] of [[AboutUsPage, 'practiceImages'], [WhatToExpectPage, 'steps'], [TreatmentAndCarePage, 'services']] as const) assert.equal((fields(config.fields)[field] as { hasMany: boolean }).hasMany, true);
  assert.equal((fields(Article.fields).slug as TextField).admin?.readOnly, true);
});
test('Current article imports as editable text with a remapped media reference', () => {
  const body = articleBody(987);
  const json = JSON.stringify(body);
  assert.ok(json.includes('987'));
  assert.ok(json.includes('Common Causes'));
  assert.ok(json.includes('Previous injuries that have changed how you move'));
  assert.ok(!json.includes('articleImages'));
  assert.ok(body.root.children.some(node => node.type === 'upload'));
  assert.ok(body.root.children.some(node => node.type === 'list'));
});
test('Patient titles retain editable superscript ordinal formatting', () => {
  assert.ok(JSON.stringify(paragraphs(['1st Visit - Initial Consult'], true)).includes('"format":64'));
});
test('Every current media reference has an available import source', () => {
  for (const image of Object.values(seed.media)) assert.ok(readFileSync(sourceFile(image)).length);
  for (const image of Object.values(seed.seoMedia)) assert.ok(readFileSync(sourceFile(image, true)).length);
});
