import fs from 'node:fs';
import { parseEnv } from 'node:util';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';
import { CopyObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { applyContentDates, historicalDates, type ContentSnapshot } from './lib/content-dates';

// An explicit, one-time local -> hosted preview copy. Never selects production
// environment files and never overwrites a populated destination database.
const base = parseEnv(fs.readFileSync('.env.local', 'utf8'));
function environment(file: string): Record<string, string> {
  const values = Object.fromEntries(Object.entries({ ...base, ...parseEnv(fs.readFileSync(file, 'utf8')) }).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
  for (const key of ['DATABASE_URL', 'CMS_DB_SCHEMA', 'S3_PREFIX', 'S3_BUCKET', 'S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'CF_PUBLIC_URL']) assert.ok(values[key]?.trim(), `Missing ${key} in ${file}`);
  return values;
}
const source = environment('.env.development.local');
const targetFile = parseEnv(fs.readFileSync('.env.preview.local', 'utf8'));
const target = environment('.env.preview.local');
const email = process.argv.find(value => value.startsWith('--email='))?.slice(8);
assert.ok(email?.includes('@'), 'Provide --email= for the existing local admin to copy');
assert.ok(targetFile.DATABASE_URL, 'The preview file must supply its own connection');
assert.ok(['localhost', '127.0.0.1'].includes(new URL(source.DATABASE_URL).hostname));
assert.ok(new URL(target.DATABASE_URL).hostname.endsWith('.neon.tech'));
assert.equal(source.CMS_DB_SCHEMA, 'payload_dev');
assert.equal(target.CMS_DB_SCHEMA, 'payload');
assert.match(source.S3_PREFIX, /^development\//);
assert.match(target.S3_PREFIX, /^preview\/[a-zA-Z0-9/_-]+$/);
assert.equal(source.S3_BUCKET, target.S3_BUCKET);
assert.equal(source.S3_ENDPOINT, target.S3_ENDPOINT);
const apply = process.argv.includes('--apply');
const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
const name = (schema: string, table: string) => `${quote(schema)}.${quote(table)}`;
const src = new pg.Client({ connectionString: source.DATABASE_URL, connectionTimeoutMillis: 15000 });
const destination = () => new pg.Client({ connectionString: target.DATABASE_URL, connectionTimeoutMillis: 15000 });
let dst = destination();
let sourceOpen = false;
let targetOpen = false;
const storage = new S3Client({ endpoint: target.S3_ENDPOINT, region: target.S3_REGION || 'auto', credentials: { accessKeyId: target.S3_ACCESS_KEY_ID, secretAccessKey: target.S3_SECRET_ACCESS_KEY } });
const skipped = new Set(['users_sessions', 'payload_kv', 'payload_locked_documents', 'payload_locked_documents_rels', 'payload_preferences', 'payload_preferences_rels', 'payload_migrations']);
const stamp = new Date().toISOString().replaceAll(':', '-');

async function tables(db: pg.Client, schema: string) {
  return (await db.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema=$1 AND table_type='BASE TABLE' ORDER BY table_name", [schema])).rows.map(row => row.table_name);
}
async function assertEmpty(db: pg.Client, names: string[]) {
  const result = await db.query(names.filter(table => table !== 'payload_migrations').map(table => `SELECT '${table.replaceAll("'", "''")}' AS table_name, EXISTS (SELECT 1 FROM ${name(target.CMS_DB_SCHEMA, table)}) AS populated`).join(' UNION ALL '));
  for (const row of result.rows) assert.equal(row.populated, false, `Preview ${row.table_name} already has records; refusing to overwrite`);
}
async function head(key: string) {
  try { return await storage.send(new HeadObjectCommand({ Bucket: target.S3_BUCKET, Key: key })); }
  catch (error) { if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) return null; throw error; }
}

try {
  await src.connect(); sourceOpen = true;
  await dst.connect(); targetOpen = true;
  const sourceTables = await tables(src, source.CMS_DB_SCHEMA);
  const targetTables = await tables(dst, target.CMS_DB_SCHEMA);
  assert.deepEqual(sourceTables, targetTables, 'Source and preview schemas must have matching tables');
  await assertEmpty(dst, targetTables);
  await src.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  const snapshot: ContentSnapshot = {};
  for (const table of sourceTables.filter(table => !skipped.has(table))) {
    // JSON serialisation retains exact database timestamps and geometry values.
    snapshot[table] = JSON.parse(JSON.stringify((await src.query(`SELECT * FROM ${name(source.CMS_DB_SCHEMA, table)} ORDER BY id`)).rows));
  }
  await src.query('COMMIT');
  // Storage copies can outlast Neon's idle timeout. Do not keep a database
  // connection open while performing remote object operations.
  await src.end(); sourceOpen = false;
  await dst.end(); targetOpen = false;
  snapshot.users = snapshot.users.filter(user => user.email === email);
  assert.equal(snapshot.users.length, 1, 'Requested admin must exist locally');
  const user = snapshot.users[0];
  snapshot.users_roles = snapshot.users_roles.filter(role => role.parent_id === user.id);
  assert.ok(snapshot.users_roles.some(role => role.value === 'admin'));
  assert.ok(user.hash && user.salt, 'Local account must have a password');
  // Copy only this current account's password hash, never archive accounts,
  // login sessions, reset tokens, or preferences belonging to other users.
  Object.assign(user, { reset_password_token: null, reset_password_expiration: null, reset_password_requested_at: null, login_attempts: 0, lock_until: null });
  if (apply) {
    fs.mkdirSync('.cms-import', { recursive: true });
    fs.writeFileSync(`.cms-import/preview-source-${stamp}.json`, JSON.stringify(snapshot), { mode: 0o600 });
  }
  const dates = applyContentDates(snapshot, historicalDates(fs.readFileSync('cms-export/payload-data.sql', 'utf8')));
  const assets: { sourceKey: string; targetKey: string }[] = [];
  for (const table of ['media', 'seo_media']) {
    for (const row of snapshot[table]) {
      assert.ok(typeof row.prefix === 'string' && row.prefix.startsWith(`${source.S3_PREFIX}/`), 'Media must belong to the source environment');
      for (const column of ['filename', 'sizes_thumbnail_filename']) {
        if (!row[column]) continue;
        const sourceKey = [row.prefix, row._objectkey, row[column]].filter(Boolean).join('/');
        assets.push({ sourceKey, targetKey: target.S3_PREFIX + sourceKey.slice(source.S3_PREFIX.length) });
      }
    }
  }
  const sourceURL = `${source.CF_PUBLIC_URL.replace(/\/$/, '')}/${source.S3_PREFIX}/`;
  const targetURL = `${target.CF_PUBLIC_URL.replace(/\/$/, '')}/${target.S3_PREFIX}/`;
  function transform(value: unknown, key = ''): unknown {
    if (typeof value === 'string') {
      if (key.endsWith('source_i_d')) return value.replace(/^[^:]+:/, 'content:');
      if (key === 'prefix') return target.S3_PREFIX + value.slice(source.S3_PREFIX.length);
      return value.replaceAll(sourceURL, targetURL);
    }
    if (Array.isArray(value)) return value.map(item => transform(item));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, transform(v, k)]));
    return value;
  }
  const prepared = transform(snapshot) as ContentSnapshot;
  const serialised = JSON.stringify(prepared);
  assert.ok(!serialised.includes('legacy:') && !serialised.includes(sourceURL));
  const counts = Object.fromEntries(Object.entries(prepared).filter(([, rows]) => rows.length).map(([table, rows]) => [table, rows.length]));
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', schema: target.CMS_DB_SCHEMA, storagePrefix: target.S3_PREFIX, adminEmail: email, counts, assets: assets.length, historicalDates: dates }));
  if (!apply) {
    console.log('Dry run complete; no database or storage writes.');
  } else {
    for (const [index, asset] of assets.entries()) {
      const from = await head(asset.sourceKey);
      assert.ok(from, `Missing source object: ${asset.sourceKey}`);
      const existing = await head(asset.targetKey);
      if (!existing) await storage.send(new CopyObjectCommand({ Bucket: target.S3_BUCKET, Key: asset.targetKey, CopySource: [target.S3_BUCKET, ...asset.sourceKey.split('/')].map(encodeURIComponent).join('/'), CopySourceIfMatch: from.ETag }));
      const to = existing ?? await head(asset.targetKey);
      assert.equal(to?.ContentLength, from.ContentLength, 'Copied file size mismatch');
      assert.equal(to?.ETag, from.ETag, 'Copied image checksum mismatch');
      if ((index + 1) % 10 === 0 || index === assets.length - 1) console.log(`Verified ${index + 1}/${assets.length} preview image files.`);
    }
    dst = destination();
    await dst.connect(); targetOpen = true;
    const dependencies = (await dst.query<{ child: string; parent: string }>(`SELECT child.relname AS child, parent.relname AS parent FROM pg_constraint fk JOIN pg_class child ON child.oid=fk.conrelid JOIN pg_namespace ns ON ns.oid=child.relnamespace JOIN pg_class parent ON parent.oid=fk.confrelid WHERE fk.contype='f' AND ns.nspname=$1`, [target.CMS_DB_SCHEMA])).rows;
    const pending = new Set(Object.keys(prepared));
    const order: string[] = [];
    while (pending.size) {
      const ready = [...pending].filter(table => !dependencies.some(fk => fk.child === table && fk.parent !== table && pending.has(fk.parent)));
      assert.ok(ready.length, 'Unresolved circular table dependencies');
      for (const table of ready) { order.push(table); pending.delete(table); }
    }
    await dst.query('BEGIN');
    try {
      await dst.query("SET LOCAL statement_timeout = '30s'");
      await dst.query(`LOCK TABLE ${targetTables.filter(table => table !== 'payload_migrations').map(table => name(target.CMS_DB_SCHEMA, table)).join(', ')} IN SHARE ROW EXCLUSIVE MODE`);
      await assertEmpty(dst, targetTables);
      for (const table of order) {
        if (!prepared[table].length) continue;
        await dst.query(`INSERT INTO ${name(target.CMS_DB_SCHEMA, table)} SELECT * FROM json_populate_recordset(NULL::${name(target.CMS_DB_SCHEMA, table)}, $1::json)`, [JSON.stringify(prepared[table])]);
      }
      // Set sequence positions before allowing subsequent admin creates.
      const sequences = (await dst.query<{ table_name: string; column_name: string }>("SELECT table_name,column_name FROM information_schema.columns WHERE table_schema=$1 AND column_default LIKE 'nextval(%'", [target.CMS_DB_SCHEMA])).rows;
      for (const column of sequences.filter(column => prepared[column.table_name]?.length)) {
        const table = name(target.CMS_DB_SCHEMA, column.table_name);
        await dst.query(`SELECT setval(pg_get_serial_sequence($1,$2), (SELECT max(${quote(column.column_name)}) FROM ${table}), true)`, [table, column.column_name]);
      }
      await dst.query('COMMIT');
    } catch (error) { await dst.query('ROLLBACK'); throw error; }
    fs.writeFileSync(`.cms-import/preview-content-${stamp}.json`, serialised, { mode: 0o600 });
    fs.writeFileSync('.cms-import/preview-preparation.json', JSON.stringify({ completedAt: new Date().toISOString(), target: createHash('sha256').update(target.DATABASE_URL).digest('hex'), schema: target.CMS_DB_SCHEMA, storagePrefix: target.S3_PREFIX, adminEmail: email, counts, assets, dates }, null, 2), { mode: 0o600 });
    console.log('Preview content and account copied. Existing local password retained; no sessions copied.');
  }
} finally {
  if (sourceOpen) await src.end();
  if (targetOpen) await dst.end();
  storage.destroy();
}
