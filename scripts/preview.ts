import fs from 'node:fs';
import { parseEnv } from 'node:util';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const [command, ...args] = process.argv.slice(2);
assert.ok(['dev', 'build', 'start'].includes(command), 'Choose dev, build or start');
const base = parseEnv(fs.readFileSync('.env.local', 'utf8'));
const preview = parseEnv(fs.readFileSync('.env.preview.local', 'utf8'));
assert.ok(preview.DATABASE_URL && new URL(preview.DATABASE_URL).hostname.endsWith('.neon.tech'), 'Preview file must supply the Neon develop connection');
assert.equal(preview.CMS_DB_SCHEMA, 'payload');
assert.match(preview.S3_PREFIX ?? '', /^preview\/[a-zA-Z0-9/_-]+$/);
assert.ok(preview.PAYLOAD_SECRET);
const env: NodeJS.ProcessEnv = { ...process.env, ...base, ...preview, NODE_ENV: command === 'dev' ? 'development' : 'production' };
const portIndex = args.findIndex(value => value === '--port' || value === '-p');
if (portIndex !== -1) {
  const port = args[portIndex + 1];
  assert.match(port ?? '', /^\d+$/);
  env.CMS_SERVER_URL = `http://localhost:${port}`;
}
// Explicit env values take precedence over Next's development env files.
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', command, ...args], { env, stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => child.kill(signal));
child.on('error', () => { console.error('Could not start the preview command.'); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
