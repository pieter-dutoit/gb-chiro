import './env';
import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, ['node_modules/payload/bin.js', ...process.argv.slice(2)], { stdio: 'inherit', env: process.env });
process.exitCode = result.status ?? 1;
