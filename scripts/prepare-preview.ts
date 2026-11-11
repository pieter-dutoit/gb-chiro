import assert from 'node:assert/strict';
import { loadCMSEnvironment as environment } from './lib/cms-environment';
import { copyCMS } from './lib/copy-cms';

const source = environment('.env.development.local');
const target = environment('.env.preview.local');
const email = process.argv.find(value => value.startsWith('--email='))?.slice(8);
assert.ok(typeof email === 'string' && email.includes('@'), 'Provide --email= for the existing local admin to copy');
assert.ok(['localhost', '127.0.0.1'].includes(new URL(source.DATABASE_URL).hostname));
assert.ok(new URL(target.DATABASE_URL).hostname.endsWith('.neon.tech'));
assert.equal(source.CMS_DB_SCHEMA, 'payload_dev');
assert.equal(target.CMS_DB_SCHEMA, 'payload');
assert.match(source.S3_PREFIX, /^development\//);
assert.match(target.S3_PREFIX, /^preview\/[a-zA-Z0-9/_-]+$/);
assert.equal(source.S3_BUCKET, target.S3_BUCKET);
assert.equal(source.S3_ENDPOINT, target.S3_ENDPOINT);

await copyCMS({ source, target, email, apply: process.argv.includes('--apply'), label: 'preview', historicalSQL: 'cms-export/payload-data.sql' });
