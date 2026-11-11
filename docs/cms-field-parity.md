# CMS field parity

Baseline: the Payload configuration immediately before commit `bbfd437`.
The restoration keeps field names, types, labels, validation and selectable
options, with explicit editor/admin write access and published-only public reads.

| Editor area | Restored fields |
| --- | --- |
| Business Details | bookingLink, email, phone; address street, suburb, state, code, mapsLink and coordinate point |
| Operating hours | ordered array; opens, closes, Monday–Sunday selections and note; 1–7 rows, unique days and HH:MM validation |
| Graphics | logo, horizontalLogo, backgroundGraphic |
| Home | landingImage, whatToExpectImage; SEO |
| About Us | welcomeImage, meetTheChiroImage, ordered practiceImages (up to four); SEO |
| Treatment and Care | ordered services relationship; SEO |
| What to Expect | ordered steps relationship; SEO |
| Contact | SEO |
| Page SEO | meta.title, meta.description; open_graph.site_name, title, description, multiple image relationship; original hidden twitter.creator and creatorId |
| Services | thumbnail, name, description, optional related article |
| Articles | generated read-only slug, author (default GB Chiropractic), optional thumbnail, title, Lexical body |
| Patient steps | icon, rich-text title, overview, rich-text description |
| Reviews | name, text, optional platform and link; all seven original platform choices |
| Social platforms | name and link; Facebook, Instagram, X, LinkedIn, YouTube, TikTok, Snapchat, Reddit, Threads, Twitch, Telegram, WhatsApp and WeChat |
| Media / SEO media | upload, replace, delete and required alternative text; crop/focal-point controls from Payload |
| Users | email, password, admin/editor roles; account and role changes restricted as before |

Drafts and revisions are restored for all former versioned collections/globals.
Business Details keeps autosave disabled. Existing page copy that was always
hardcoded remains hardcoded. Current article summary/keywords are preserved in
hidden metadata fields; internal sourceID fields support safe imports.

`pnpm test` checks the field/type inventory, relationship multiplicity, platform
options and rich-text import. `pnpm cms:verify` checks actual access control,
publishing semantics, hours validation and populated relationships in Postgres.
