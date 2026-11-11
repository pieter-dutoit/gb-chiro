import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProductionEnvironment } from '../scripts/lib/cms-environment';

const shared = { CMS_DB_SCHEMA: 'payload', S3_BUCKET: 'images', S3_ENDPOINT: 'https://example.r2.cloudflarestorage.com' };
const source = { ...shared, DATABASE_URL: 'postgresql://user:password@ep-preview-pooler.region.neon.tech/cms', S3_PREFIX: 'preview/develop', PAYLOAD_SECRET: 'preview-secret' };
const target = { ...shared, DATABASE_URL: 'postgresql://user:password@ep-production-pooler.region.neon.tech/cms', S3_PREFIX: 'production', PAYLOAD_SECRET: 'a'.repeat(64), CMS_SERVER_URL: 'https://gbchiropractic.com.au' };

test('Production preparation accepts distinct Neon and storage environments', () => {
  assert.doesNotThrow(() => validateProductionEnvironment(source, target));
});

test('Production preparation rejects the preview database even with an unpooled URL', () => {
  assert.throws(() => validateProductionEnvironment(source, { ...target, DATABASE_URL: source.DATABASE_URL.replace('-pooler.', '.') }), /separate database endpoint/);
});

test('Production preparation rejects crossed storage, origin and secret settings', () => {
  for (const change of [
    { S3_PREFIX: 'preview/develop' }, { CMS_DB_SCHEMA: 'payload_dev' },
    { CMS_SERVER_URL: 'http://localhost:3000' }, { PAYLOAD_SECRET: source.PAYLOAD_SECRET },
  ]) assert.throws(() => validateProductionEnvironment(source, { ...target, ...change }));
});
