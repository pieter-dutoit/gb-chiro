import './env';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';

if (!process.stdin.isTTY) throw new Error('Run cms:admin in an interactive terminal; passwords are never accepted as command-line arguments.');
let muted = false;
const output = new Writable({ write(chunk, _encoding, callback) { if (!muted) process.stdout.write(chunk); callback(); } });
const rl = createInterface({ input: process.stdin, output, terminal: true });
const email = (await rl.question('Admin email: ')).trim().toLowerCase();
process.stdout.write('Password (at least 16 characters, input hidden): ');
muted = true;
const password = await rl.question('');
muted = false;
process.stdout.write('\n');
rl.close();
if (!email.includes('@') || password.length < 16) throw new Error('Provide an email and a password of at least 16 characters.');
const { getPayload } = await import('payload');
const { default: config } = await import('../src/payload.config');
const payload = await getPayload({ config });
try {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, overrideAccess: true });
  if (process.argv.includes('--reset-password')) {
    if (!existing.docs[0]) throw new Error('Account not found.');
    await payload.update({ collection: 'users', id: existing.docs[0].id, data: { password }, overrideAccess: true });
    console.log('Password updated.');
  } else {
    const count = await payload.count({ collection: 'users', overrideAccess: true });
    if (count.totalDocs) throw new Error('Accounts already exist. Use the admin UI to manage users, or --reset-password for recovery.');
    await payload.create({ collection: 'users', data: { email, password, roles: ['admin'] }, context: { bootstrap: true }, overrideAccess: true });
    console.log('First admin created. Sign in at /admin.');
  }
} finally { await payload.destroy(); }
process.exit(0);
