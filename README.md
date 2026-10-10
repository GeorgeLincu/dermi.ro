# dermi.ro

The professional website of **Dr. Mădălina Iulia Lincu**, specialist in dermatology and venereology
(Romania): evidence-based articles in Romanian about skin, hair and nail health and STIs.

- **Stack:** [Astro](https://astro.build) static site → Cloudflare Workers (static assets), free tier.
- **Deploys:** every push to `main` is built and deployed by Cloudflare *Workers Builds* (Worker `dermi`,
  deploy command `npx wrangler deploy`, non-production branch builds off). Check what is live at
  `https://dermi.ro/version.json` (commit SHA). **Never delete the "Workers Builds" API token** that
  Cloudflare created for this — every build fails afterwards ("build token deleted or rolled").
- **Languages:** Romanian at `/`, English core pages under `/en/` (articles are Romanian only).
- **Never push to `main` directly** — open a pull request; CI must be green before merging.

**New here (human or AI)?** Read [CLAUDE.md](CLAUDE.md) and [docs/STATUS.md](docs/STATUS.md) first.

## Everyday tasks

| I want to… | Do this |
|---|---|
| Write or edit an article | `src/content/blog/<slug>.md` — follow [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md). New articles start with `draft: true`. |
| Publish an article | Set `draft: false` (after the doctor has reviewed it and removed every `[TODO …]`). The build refuses published articles that still contain `[TODO`. |
| See drafts locally | `npm run dev` → http://localhost:4321 (drafts are shown with a "CIORNĂ" badge) |
| Build exactly like production | `npm run build` (output in `dist/`) |
| Build including drafts | `PREVIEW_DRAFTS=1 npm run build` — never in production |
| Create social images for new articles | `npm run og` (uses local Edge/Chrome; `--force` re-renders all) |
| Change the doctor's details, booking link, e-mail | `src/config.ts` — empty fields are hidden on the site |
| Add the doctor's photo | Put a square JPG at `public/assets/madalina-lincu.jpg` (≈800×800) |
| Add a redirect | `public/_redirects` |
| Change security headers / CSP | `public/_headers` |
| Type-check | `npm run check` (site + Worker) |
| Write/publish articles from the browser | https://dermi.ro/vault/ — see [docs/VAULT.md](docs/VAULT.md) |
| Run the Worker + vault locally | `cp .dev.vars.example .dev.vars` then `npm run preview` |
| Check the live site's health | GitHub → Actions → **Site monitor** (runs hourly; opens an issue on failure) |
| Cloudflare settings (DNS, e-mail, WAF, Access) | [docs/CLOUDFLARE-SETUP.md](docs/CLOUDFLARE-SETUP.md) |
| Record where an image comes from | [docs/IMAGE-RIGHTS.md](docs/IMAGE-RIGHTS.md) |
| See what's done / open / planned | [docs/STATUS.md](docs/STATUS.md) |
| Growth strategy (Romanian) | [docs/STRATEGIE.md](docs/STRATEGIE.md) |

## Structure

```
src/content/blog/      articles (Markdown + frontmatter, schema in src/content.config.ts)
src/lib/categories.ts  topic clusters (afectiuni, venerologie, ingrediente, …)
src/lib/seo.ts         JSON-LD (WebSite, Person, BlogPosting, BreadcrumbList, FAQPage)
src/lib/agents.ts      llms.txt, llms-full.txt, Markdown twins for AI agents
src/i18n/ui.ts         UI strings (ro/en) and the RO↔EN page pairs
src/pages/             routes (Romanian at /, English at /en/)
worker/                Worker: vault (auth, files, share links, article editor), /media, /api/contact
public/_headers        security headers + caching
public/_redirects      redirects (old Jekyll URLs are added by scripts/postbuild.mjs)
scripts/postbuild.mjs  Markdown header rules, old-URL redirects, [TODO] guard
scripts/og-images.mjs  1200×630 social cards + icons
```

## For AI agents and search engines

`/llms.txt`, `/llms-full.txt`, `/index.md`, `/blog/<slug>.md`, `/sitemap.xml`, `/rss.xml`.
`robots.txt` allows search and AI use (`Content-Signal: search=yes, ai-input=yes, ai-train=yes`).

## Content rules (short version)

No invented testimonials, patient stories, statistics or credentials; no brand names; no doses for
prescription medicines; EU cosmetics claim rules and the CMR deontology code apply. Full rules:
[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md). Review checklist for the drafts:
[docs/REVIEW-ARTICOLE.md](docs/REVIEW-ARTICOLE.md).
