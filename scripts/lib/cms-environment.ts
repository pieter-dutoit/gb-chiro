import fs from 'node:fs';
import { parseEnv } from 'node:util';
import assert from 'node:assert/strict';

export function loadCMSEnvironment(file: string): Record<string, string> {
  const base = parseEnv(fs.readFileSync('.env.local', 'utf8'));
  const explicit = parseEnv(fs.readFileSync(file, 'utf8'));
  assert.ok(explicit.DATABASE_URL, `${file} must supply its own database connection`);
  const values = Object.fromEntries(Object.entries({ ...base, ...explicit })
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
  for (const key of ['DATABASE_URL', 'CMS_DB_SCHEMA', 'S3_PREFIX', 'S3_BUCKET', 'S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'CF_PUBLIC_URL']) {
    assert.ok(values[key]?.trim(), `Missing ${key} in ${file}`);
  }
  return values;
}

export function validateProductionEnvironment(source: Record<string, string>, target: Record<string, string>) {
  const endpoint = (env: Record<string, string>) => new URL(env.DATABASE_URL).hostname.replace(/-pooler(?=\.)/, '');
  assert.ok(endpoint(source).endsWith('.neon.tech') && endpoint(target).endsWith('.neon.tech'), 'Both connections must be Neon endpoints');
  assert.notEqual(endpoint(source), endpoint(target), 'Production must use a separate database endpoint');
  assert.equal(source.CMS_DB_SCHEMA, 'payload');
  assert.equal(target.CMS_DB_SCHEMA, 'payload');
  assert.match(source.S3_PREFIX, /^preview\/[a-zA-Z0-9/_-]+$/);
  assert.equal(target.S3_PREFIX, 'production');
  assert.equal(target.CMS_SERVER_URL, 'https://gbchiropractic.com.au');
  assert.ok(target.PAYLOAD_SECRET?.length >= 32, 'Production needs a private Payload secret');
  assert.ok(target.PAYLOAD_SECRET !== source.PAYLOAD_SECRET, 'Production and preview need distinct secrets');
  assert.equal(source.S3_BUCKET, target.S3_BUCKET);
  assert.equal(source.S3_ENDPOINT, target.S3_ENDPOINT);
  assert.equal(new URL(target.S3_ENDPOINT).pathname, '/');
}
