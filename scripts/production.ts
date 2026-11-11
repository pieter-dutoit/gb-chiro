import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { loadCMSEnvironment, validateProductionEnvironment } from './lib/cms-environment';

const [command, ...args] = process.argv.slice(2);
assert.ok(['migrate', 'migrate:status', 'build', 'start'].includes(command), 'Choose migrate, migrate:status, build or start');
const production = loadCMSEnvironment('.env.production.local');
validateProductionEnvironment(loadCMSEnvironment('.env.preview.local'), production);
const env: NodeJS.ProcessEnv = { ...process.env, ...production, CMS_ENV: 'production', NODE_ENV: 'production' };
const portIndex = args.findIndex(value => value === '--port' || value === '-p');
if (portIndex !== -1) {
  const port = args[portIndex + 1];
  assert.match(port ?? '', /^\d+$/);
  env.CMS_SERVER_URL = `http://localhost:${port}`;
}
const cli = command.startsWith('migrate')
  ? ['--import', 'tsx', 'node_modules/payload/bin.js']
  : ['node_modules/next/dist/bin/next'];
const child = spawn(process.execPath, [...cli, command, ...args], { env, stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => child.kill(signal));
child.on('error', () => { console.error('Could not start the production command.'); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
