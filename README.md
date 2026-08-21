# Know Nothing Daily

An editorial publication and database-backed CMS for articles, notes, films, and places. The public site preserves the original cream, navy, coral, and acid-lime identity while `/admin` provides a practical editing workspace.

## What is included

- Public home, search, category, tag, article, note, film, and place pages
- Protected `/admin` dashboard with draft/publish/unpublish/delete workflows
- Rich text editing, previews, featured content, SEO fields, categories, and tags
- Image and video media library backed by R2
- D1 relational data for users, content, media metadata, settings, and activity
- ChatGPT sign-in plus server-side admin/editor authorization
- Sitemap, robots rules, canonical URLs, Open Graph, X cards, and accessible error states

## Requirements

- Node.js 22.13 or newer
- A Sites deployment with D1 and R2 enabled
- An authenticated ChatGPT account email configured in `ADMIN_EMAILS`

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The D1 tables and the two existing Know Nothing Daily discoveries are initialized safely on first use. The Drizzle schema in `db/schema.ts` remains the source of truth for migration generation.

## Environment values

| Name | Required | Purpose |
| --- | --- | --- |
| `ADMIN_EMAILS` | Production | Comma-separated ChatGPT account emails that may bootstrap as administrators |
| `SITE_URL` | Production | Canonical deployed origin used for absolute social metadata |

Never commit `.env.local` or production credentials. Configure hosted values through Sites.

## Admin account and roles

1. Add the owner’s ChatGPT account email to `ADMIN_EMAILS` in the hosted environment.
2. Visit `/admin` and use Sign in with ChatGPT.
3. The allowlisted account is stored as an administrator in D1.
4. Administrators can add other administrators or editors from **Users**.

Editors can manage content, categories, tags, and media. Administrators additionally control publication settings and user roles. Every write endpoint repeats authorization on the server; hiding a button is never treated as security.

## Content lifecycle

Create → edit → autosave draft → preview → publish → update → unpublish → delete.

Only records whose status is `published` are returned by public queries. Draft previews require an authorized admin/editor session.

## Database and migrations

```bash
npm run db:generate
```

Generated SQL is saved under `drizzle/`. Inspect every migration before deployment. The production schema includes indexed content status/date and category/status paths for growing archives.

## Media storage

Files are stored as R2 objects; searchable metadata, alt text, captions, ownership, and usage checks live in D1. Images are limited to 25 MB and videos to 250 MB at the application boundary. Public objects receive long-lived immutable cache headers.

## Verification

```bash
npm run lint
npm test
npm run build
```

Critical checks cover persistent bindings, protected admin mutations, public draft exclusion, editorial lifecycle controls, and removal of starter-only UI.

## Deployment and backups

Sites provisions the real D1 database and R2 bucket declared in `.openai/hosting.json`. Before launch, set `ADMIN_EMAILS` and `SITE_URL`, apply the generated migration, and verify `/admin`, one published detail page, search, media upload, and a draft preview.

Back up both layers:

- Export D1 regularly for content, settings, relationships, and media metadata.
- Retain or replicate the R2 bucket for original image/video files.
- Test restores periodically; a database export without its matching R2 objects is incomplete.
