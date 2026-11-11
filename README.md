# GB Chiropractic

Next.js 16 with Payload 3.93, Postgres/PostGIS and Cloudflare R2. The public site
renders each request from explicitly cached, published CMS queries; `/admin` provides the original editor fields,
rich-text articles, drafts, revisions and admin/editor roles.

## Local development

Use Node **24.22.1 or newer within Node 24** (`.nvmrc`) and pnpm 11.3.0.

```sh
nvm install
nvm use
pnpm install
docker compose -p gb-chiro-cms-dev up -d --wait
```

Keep the Neon connection and R2 credentials in the ignored `.env.local` file.
Create an ignored `.env.development.local` with the following overrides to keep
local work separate from Neon and production media:

```dotenv
DATABASE_URL=postgresql://gb_chiro:local-development-only@localhost:55433/gb_chiro_cms_dev
CMS_DB_SCHEMA=payload_dev
CMS_SERVER_URL=http://localhost:3000
S3_PREFIX=development/feat-new-cms
```

The Docker database is bound to localhost only. Its password is for local use.
The existing address coordinate editor requires the PostGIS extension; the
provided container includes it. Keep Docker running while using the local CMS.

```sh
pnpm payload migrate
pnpm cms:import --dry-run
pnpm cms:import
pnpm cms:admin
pnpm dev
```

`cms:admin` prompts privately for the first administrator's email and password.
Public first-user registration is disabled. Admins create additional editor
accounts in the CMS. Email delivery is intentionally disabled; for account
recovery run `pnpm cms:admin --reset-password` and enter the account email and a
new password. Credentials are never accepted as CLI arguments.

Open <http://localhost:3000/admin> or <http://localhost:3000>.

## Environment variables

See `.env.example`. Required variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string; use Neon pooling for the deployed app |
| `PAYLOAD_SECRET` | Stable private secret used by Payload authentication |
| `CMS_DB_SCHEMA` | Explicit schema, such as `payload_dev` locally or `payload` in production |
| `CMS_SERVER_URL` | Admin/API origin; defaults to the Vercel deployment URL, or localhost |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION` | R2 bucket, account S3 endpoint without bucket suffix, and `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Bucket-scoped object read/write credentials |
| `S3_PREFIX` | Explicit storage namespace; use a distinct development/preview prefix |
| `CF_PUBLIC_URL` | Public base URL for the bucket; use a custom domain for production |

CLI commands load the development environment by default. Only an explicit
`CMS_ENV=production` switches them to production environment files. Do not set
`NODE_ENV=production` for ordinary local development.

For preview deployments, use a Neon preview branch and a unique `S3_PREFIX`
(e.g. `preview/branch-name`), not `production`. Imported production media in a
cloned database can be displayed, but media changes/deletes are rejected when
the record belongs to another prefix; upload a preview copy to replace it.

For the persistent hosted `develop` CMS, `.env.preview.local` supplies its Neon
connection, `CMS_DB_SCHEMA=payload`, `S3_PREFIX=preview/develop`, preview
`PAYLOAD_SECRET`, and `CMS_SERVER_URL=http://localhost:3000`. Shared R2 settings
come from `.env.local`. Both files are ignored by Git. Run `pnpm dev:preview`,
`pnpm build:preview`, or `pnpm start:preview` to explicitly use these settings.
An optional `--port 3001` also sets the matching local admin origin.
Public content cache keys include the database and storage environment, so
switching between local and hosted preview does not reuse the other CMS's data.
Use the same Neon connection and `S3_PREFIX=preview/develop` in Vercel Preview.
Once its URL is available, add that origin to the R2 upload CORS policy below.

To initialise an empty, migrated preview database from the current local CMS:

```sh
node --import tsx scripts/prepare-preview.ts --email=YOUR_ADMIN_EMAIL
node --import tsx scripts/prepare-preview.ts --email=YOUR_ADMIN_EMAIL --apply
```

The first command is a dry run. The second copies content, relationships and
saved revisions, plus that existing local admin's password hash and role. It
does not copy login sessions, password-reset tokens or saved preferences.
Original content dates are read from the available SQL archive; its SQL and
accounts are never executed/imported. Subsequent saved edits and newly uploaded
media keep their actual dates. Preview internal identifiers use `content:`.
Images and admin thumbnails are copied byte-for-byte to the preview prefix and
checked by size and checksum. Private snapshots and a receipt are saved under
`.cms-import/`. A populated destination is never overwritten. The production
database and the local source are not modified.

## Browser uploads

Payload uploads files directly to R2, so uploads up to 20 MB do not pass through
Vercel's request-body limit. Configure **R2 → bucket → Settings → CORS policy**.
For local development:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD", "PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Preserve existing rules. Add the actual production and preview admin origins
when enabling those deployments. The object read/write API token does not grant
permission to edit bucket-level CORS settings.

Ordinary media retains one source and a small admin thumbnail. Next Image
provides responsive public sizes. SVG icons remain SVGs. SEO media retains the
previous 1200 × 630 crop and 600 × 315 thumbnail. The storage adapter includes
client-upload object keys in URLs; changing `CF_PUBLIC_URL` requires no upload
migration. Public image URLs include a revision parameter after changes so
replacements cannot remain stuck in Next Image's old cache.

## Import and recovery

Current content in `src/lib/site-data.ts` and the article MDX is retained as an
import source, never a runtime fallback. The optional local
`cms-export/payload-data.sql` recovers additional media metadata only. The raw
dump is never executed and old accounts, passwords and revisions are not imported.

Images come from the largest suitable files in `public/images/`, with archived
originals under `cms-export/image-source-archive/full/` for small public images.
Preserve that ignored archive and the SQL export in a separate backup.

The importer performs source-file validation before writing, imports media before
relationships, and records progress in ignored `.cms-import/` manifests. Internal
unique `sourceID` values make retries resumable without duplicate records. It
verifies R2 originals and thumbnails, repairs missing unchanged source uploads,
and fails rather than overwriting a subsequently replaced file. Existing content,
including intentionally empty relationship selections, is retained on reruns.
Restart the local server after an import to clear any pre-import page cache.

## Verification

```sh
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm cms:verify
```

`cms:verify` only accepts a localhost database. It creates temporary test accounts
and content, checks permissions/draft publication and imported relationships, and
removes its test records. Run it after importing into the development database.

A production build uses production environment files. To build against the local
database while keeping the Neon credentials untouched:

```sh
DATABASE_URL=postgresql://gb_chiro:local-development-only@localhost:55433/gb_chiro_cms_dev \
CMS_DB_SCHEMA=payload_dev S3_PREFIX=development/feat-new-cms \
CMS_SERVER_URL=http://localhost:3000 pnpm build
```

Use the same overrides for `pnpm start`. `pnpm dev` reads them from
`.env.development.local` automatically.

## Deployment handoff

This branch does not deploy or modify production. When deployment is separately
authorized:

1. Back up the target database and media; preserve the original recovery files.
2. Configure Vercel Node 24, all required environment variables, the correct
   database branch and matching function/database regions, and R2 CORS origins.
3. Enable PostGIS on the target Postgres database. The database role must be able
   to create the CMS schema and run migrations.
4. Run `CMS_ENV=production pnpm payload migrate`, then the import and admin setup
   commands with the same explicit environment. Never seed automatically on boot
   or in every Vercel build. Schema push is disabled.
5. Build and review a preview deployment, test editing/publishing/uploads, then
   promote through the normal release process.

Migrations use `CMS_DB_SCHEMA` rather than a hardcoded development schema. Generate
future migrations against the development schema and review their SQL before
running them elsewhere. Keep generated types and admin import maps in Git.

Take database dumps and R2 backups before schema changes. A database rollback
alone cannot recover deleted objects, so retain both. The original static site
and source archive remain available in Git/local backups for rollback.
