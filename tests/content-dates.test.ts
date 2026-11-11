import test from 'node:test';
import assert from 'node:assert/strict';
import { historicalDates, applyContentDates, type ContentSnapshot } from '../scripts/lib/content-dates';

const dates = { created_at: '2025-09-01T00:00:00.000Z', updated_at: '2025-09-20T00:00:00.000Z' };
const initial = '2026-11-11T06:00:00.000Z';
const edited = '2026-11-11T11:00:00.000Z';

test('Archive date extraction handles quoted commas, apostrophes, JSON and multiline strings', () => {
  const sql = `INSERT INTO payload.articles (id, body, created_at, updated_at) VALUES (11, '{"text":"Patient''s care, movement);\\nnext"}', '2025-09-01 00:00:00+00', '2025-09-20 00:00:00+00');
INSERT INTO payload.home_page (id, title, created_at, updated_at) VALUES (1, 'First line,
second line', '2025-09-01 00:00:00+00', '2025-09-20 00:00:00+00');
INSERT INTO payload.users (id, created_at, updated_at) VALUES (1, '2025-09-01 00:00:00+00', '2025-09-20 00:00:00+00');`;
  const result = historicalDates(sql);
  assert.deepEqual(result.get('articles:11'), dates);
  assert.deepEqual(result.get('home_page:1'), dates);
  assert.equal(result.size, 2);
});

test('Unedited content and its initial revision retain known original dates', () => {
  const snapshot: ContentSnapshot = {
    services: [{ id: 1, source_i_d: 'legacy:services:5', created_at: initial, updated_at: initial }],
    _services_v: [{ id: 1, parent_id: 1, version_created_at: initial, version_updated_at: initial, created_at: initial, updated_at: initial }],
  };
  applyContentDates(snapshot, new Map([['services:5', dates]]));
  assert.equal(snapshot.services[0].created_at, dates.created_at);
  assert.equal(snapshot.services[0].updated_at, dates.updated_at);
  assert.equal(snapshot._services_v[0].created_at, dates.updated_at);
  assert.equal(snapshot._services_v[0].version_created_at, dates.created_at);
});

test('Genuine subsequent edits keep their modification and revision dates', () => {
  const snapshot: ContentSnapshot = {
    home_page: [{ id: 1, created_at: initial, updated_at: edited }],
    _home_page_v: [
      { id: 1, version_created_at: initial, version_updated_at: initial, created_at: initial, updated_at: initial },
      { id: 2, version_created_at: initial, version_updated_at: edited, created_at: edited, updated_at: edited },
    ],
  };
  assert.deepEqual(applyContentDates(snapshot, new Map([['home_page:1', dates]])), { matched: 1, recentEdits: 1 });
  assert.equal(snapshot.home_page[0].created_at, dates.created_at);
  assert.equal(snapshot.home_page[0].updated_at, edited);
  assert.equal(snapshot._home_page_v[1].created_at, edited);
  assert.equal(snapshot._home_page_v[1].version_created_at, dates.created_at);
});

test('New media does not inherit unrelated historical dates through coinciding IDs', () => {
  const snapshot: ContentSnapshot = { media: [{ id: 1, source_i_d: null, created_at: edited, updated_at: edited }] };
  assert.equal(applyContentDates(snapshot, new Map([['media:1', dates]])).matched, 0);
  assert.equal(snapshot.media[0].created_at, edited);
});
