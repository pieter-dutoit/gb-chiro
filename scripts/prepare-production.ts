import assert from 'node:assert/strict';
import { loadCMSEnvironment, validateProductionEnvironment } from './lib/cms-environment';
import { copyCMS } from './lib/copy-cms';

const source = loadCMSEnvironment('.env.preview.local');
const target = loadCMSEnvironment('.env.production.local');
validateProductionEnvironment(source, target);
const email = process.argv.find(value => value.startsWith('--email='))?.slice(8);
assert.ok(typeof email === 'string' && email.includes('@'), 'Provide --email= for the preview admin to copy');

// Preview already holds the original dates. Preserve these and every subsequent
// edit exactly; do not reapply archive dates over newer content.
await copyCMS({ source, target, email, apply: process.argv.includes('--apply'), label: 'production' });
