import test from 'node:test';
import assert from 'node:assert/strict';
import { cmsCacheKey } from '../src/lib/cms-cache-key';

const preview = { DATABASE_URL: 'postgresql://user:password@develop-pooler.example.com/cms', CMS_DB_SCHEMA: 'payload', S3_PREFIX: 'preview/develop', CF_PUBLIC_URL: 'https://media.example.com' };

test('Public content caches are isolated by database, schema and media environment', () => {
  const key = cmsCacheKey(preview);
  for (const change of [
    { DATABASE_URL: 'postgresql://user:password@production.example.com/cms' },
    { DATABASE_URL: 'postgresql://user:password@develop-pooler.example.com/other' },
    { CMS_DB_SCHEMA: 'payload_dev' }, { S3_PREFIX: 'production' },
    { CF_PUBLIC_URL: 'https://other.example.com' },
  ]) assert.notEqual(cmsCacheKey({ ...preview, ...change }), key);
});

test('The same database shares a cache identity across credentials and pooling modes', () => {
  assert.equal(cmsCacheKey(preview), cmsCacheKey({ ...preview, DATABASE_URL: 'postgresql://other:rotated@develop.example.com/cms?sslmode=require' }));
  assert.match(cmsCacheKey(preview), /^[a-f0-9]{64}$/);
});
