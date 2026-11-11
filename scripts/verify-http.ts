import './env';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { paragraphs } from './lib/seed';
const base = 'http://localhost:3000';
const credentials = JSON.parse(fs.readFileSync('.cms-import/browser-test-user.json', 'utf8'));
const login = await fetch(`${base}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
const { token } = await login.json();
assert.ok(token, 'Temporary test login');
async function api(path: string, method = 'GET', data?: unknown) {
  const response = await fetch(`${base}/api/${path}`, { method, headers: { Authorization: `JWT ${token}`, Origin: base, ...(data ? { 'Content-Type': 'application/json' } : {}) }, body: data ? JSON.stringify(data) : undefined });
  const result = await response.json();
  assert.ok(response.ok, `${method} ${path} returned ${response.status}: ${JSON.stringify(result.errors ?? '')}`);
  return result.doc ?? result;
}
let articleID: number | undefined;
let serviceOrder: number[] | undefined;
let originalMeta: { title: string; description: string } | undefined;
try {
  const article = await api('articles', 'POST', { title: `CMS Browser Verification ${Date.now()}`, author: 'Verification author', body: paragraphs(['Published verification copy']), _status: 'published' });
  articleID = article.id;
  let page: Response;
  let publishedHTML = '';
  for(let attempt=0; attempt<10; attempt++) {
    page = await fetch(`${base}/treatment-and-care/${article.slug}`);
    publishedHTML = await page.text();
    if (publishedHTML.includes('Published verification copy')) break;
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  assert.ok(publishedHTML.includes('Published verification copy'));
  await api(`articles/${articleID}?draft=true`, 'PATCH', { body: paragraphs(['Private verification draft']), _status: 'draft' });
  const html = await (await fetch(`${base}/treatment-and-care/${article.slug}`)).text();
  assert.ok(html.includes('Published verification copy')); assert.ok(!html.includes('Private verification draft'));
  await api(`articles/${articleID}?draft=false`, 'PATCH', { _status: 'draft' });
  const anonymousCheck = await fetch(`${base}/api/articles/${articleID}?draft=false`);
  console.log('Unpublished API status:', anonymousCheck.status);
  let unavailable = '';
  for (let attempt = 0; attempt < 10; attempt++) {
    page = await fetch(`${base}/treatment-and-care/${article.slug}`);
    unavailable = await page.text();
    if (!unavailable.includes('Published verification copy') && !unavailable.includes('Private verification draft')) break;
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  assert.ok(!unavailable.includes('Published verification copy') && !unavailable.includes('Private verification draft'));
  assert.ok(unavailable.includes('noindex'));
  console.log('PASS: new public article without rebuild, hidden draft edits, unpublish removes route.');

  const treatment = await api('globals/treatment-and-care-page?depth=0');
  serviceOrder = treatment.services;
  const reversed = [...serviceOrder!].reverse();
  await api('globals/treatment-and-care-page', 'POST', { services: reversed, _status: 'published' });
  const current = await api('globals/treatment-and-care-page?depth=0');
  assert.deepEqual(current.services, reversed);
  const first = await api(`services/${reversed[0]}`);
  const last = await api(`services/${reversed[reversed.length-1]}`);
  let serviceHTML = '';
  for (let attempt=0; attempt<10; attempt++) {
    serviceHTML = (await (await fetch(`${base}/treatment-and-care`)).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replaceAll('&amp;', '&');
    if (serviceHTML.indexOf(first.name) >= 0 && serviceHTML.indexOf(first.name) < serviceHTML.indexOf(last.name)) break;
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  assert.ok(serviceHTML.indexOf(first.name) >= 0 && serviceHTML.indexOf(first.name) < serviceHTML.indexOf(last.name));
  console.log('PASS: ordered services publish to the public page.');

  const home = await api('globals/home-page?depth=0'); originalMeta = home.seo.meta;
  await api('globals/home-page', 'POST', { seo: { meta: { ...originalMeta, title: 'CMS verification title' } }, _status: 'published' });
  let homepage = '';
  for (let attempt=0; attempt<10; attempt++) {
    homepage = await (await fetch(base)).text();
    if (homepage.includes('<title>CMS verification title</title>')) break;
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  assert.ok(homepage.includes('<title>CMS verification title</title>'));
  console.log('PASS: published SEO invalidates public metadata.');

  const testMedia = (await api('media?where[alt][equals]=Temporary%20browser%20upload%20verification')).docs[0];
  if (testMedia) {
    const form = new FormData();
    form.set('_payload', JSON.stringify({ alt: 'Replacement verification' }));
    form.set('file', new Blob([fs.readFileSync('public/images/gb-chiropractic-logo-256w.webp')], { type: 'image/webp' }), 'cms-browser-verification.webp');
    const replacement = await fetch(`${base}/api/media/${testMedia.id}`, { method: 'PATCH', headers: { Authorization: `JWT ${token}`, Origin: base }, body: form });
    assert.equal(replacement.status, 200);
    const replaced = (await replacement.json()).doc;
    assert.equal(replaced.width, 256);
    assert.equal((await fetch(replaced.url)).status, 200);
    await api(`media/${testMedia.id}`, 'DELETE');
    console.log('PASS: image replacement, public delivery and deletion.');
  }
} finally {
  if (articleID) await api(`articles/${articleID}`, 'DELETE');
  if (serviceOrder) await api('globals/treatment-and-care-page', 'POST', { services: serviceOrder, _status: 'published' });
  if (originalMeta) await api('globals/home-page', 'POST', { seo: { meta: originalMeta }, _status: 'published' });
}
