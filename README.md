# GB Chiropractic

A Next.js site for GB Chiropractic. Content is stored in the repository, and
the build has no database or CMS dependency. `pnpm build` creates the standard
Next.js production build in `.next/`.

## Development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

Useful checks:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

No environment variables are required to build the public site.

## Content

Static business and page data lives in `src/lib/site-data.ts`. Article copy is
stored as local MDX under `src/content/`.

## Images

Production images live in `public/images/` and are served as ordinary static
files. The site uses native responsive `img` elements and pre-generated WebP
variants, so it does not call the Vercel/Next.js Image Optimization service.

`src/lib/media-variants.ts` describes the available generated files, while
`src/lib/utils/media-url.ts` selects the small production width set used in
`srcset` output. Keep only the widths needed by the layout when adding an image:

- logos: 128–480 px
- service cards: 128, 256, and 384 px
- article imagery: 384, 640, and 828 px
- large section and hero imagery: 384, 640, 828, 1200, and 1920 px

The full pre-refactor image collection is retained locally at
`cms-export/image-source-archive/full/`. That directory is intentionally
ignored by Git and excluded from deployments; keep a separate backup before
removing it from a development machine.

## Deployment

Vercel can deploy this as a standard Next.js project. For a local production
run, use `pnpm build` followed by `pnpm start`.
