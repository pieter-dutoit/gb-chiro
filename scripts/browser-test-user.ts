import './env';
import fs from 'node:fs';
import { randomBytes } from 'node:crypto';
if (new URL(process.env.DATABASE_URL!).hostname !== 'localhost') throw new Error('Local browser testing only');
const { getPayload } = await import('payload');
const { default: config } = await import('../src/payload.config');
const payload = await getPayload({ config });
const location = '.cms-import/browser-test-user.json';
try {
  if (process.argv.includes('--remove')) {
    const { id } = JSON.parse(fs.readFileSync(location, 'utf8'));
    await payload.delete({ collection: 'users', id, overrideAccess: true });
    fs.unlinkSync(location);
    console.log('Temporary browser-test account removed.');
  } else {
    const password = randomBytes(24).toString('hex');
    const email = `browser-${randomBytes(6).toString('hex')}@example.test`;
    const user = await payload.create({ collection: 'users', data: { email, password, roles: ['admin'] }, overrideAccess: true, context: { bootstrap: true } });
    fs.writeFileSync(location, JSON.stringify({ id: user.id, email, password }), { mode: 0o600 });
    console.log('Temporary browser-test account created; credentials saved privately.');
  }
} finally { await payload.destroy(); }
process.exit(0);
