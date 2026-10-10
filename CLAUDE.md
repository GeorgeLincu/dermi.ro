# CLAUDE.md — dermi.ro

Read this first, then `docs/STATUS.md` (what is done, what is open). Everything below was true on 2026-10-01.

## What this is

**dermi.ro** is the professional site of **Dr. Mădălina Iulia Lincu** (no hyphen), *medic specialist
Dermatovenerologie*, CMR code 2620033311. She practises as a collaborator (PFI) at Dr. Leventer Centre
(drleventercentre.com), two Bucharest locations. Name: "derm" (skin) + "MI" (Mădălina Iulia).
Goal: visibility on Google and AI assistants, with evidence-based Romanian articles. Possible later: booking,
online consultations, product recommendations / affiliate links (check with CMR first; see docs/STRATEGIE.md).

People:
- **George Lincu** (george.lincu@gmail.com) builds and administers the site; works from a BearingPoint laptop.
  **Talk to him in Romanian**. Code, commits, PRs and docs are in English.
- **Dr. Mădălina** (drmadalinalincu@gmail.com) writes and publishes in the vault. Both are vault admins.

## Golden rules (learned the hard way)

1. **Never push to `main`.** Feature branch → PR (`gh pr create`) → merge only when CI is green
   (branch protection requires "Type-check, build & Lighthouse" and "Build with drafts"). Small, themed PRs.
2. Before git operations run `git status` and `git branch --show-current`; other Claude sessions work on geoli.
3. **Never invent content**: no testimonials, patient stories, statistics about "my results", credentials or
   facts about the doctor. Unknown → `[TODO: Dr. Mădălina …]`. The build refuses to publish text with `[TODO`.
4. AI-written articles are always `draft: true`; only the doctor publishes (from /vault/).
5. Medical/legal: CMR deontology (informative, not promotional), no brand names, no doses for prescription
   drugs, botulinum toxin is never promoted, EU cosmetics claims rules (Reg. 1223/2009, 655/2013). See
   `docs/CONTENT-GUIDE.md`.
6. **Secrets**: never print, log or commit tokens. Read them only inside commands from
   `C:\Users\george.lincu\.secrets\` (`cloudflare-token.txt` — expires **2026-10-31**; `dermi-share-secret.txt`).
   Worker secrets `GITHUB_TOKEN` and `SHARE_SECRET` are set by George in the dashboard as type **Secret**
   (a "Text" variable is wiped on the next deploy). Don't enter tokens into services yourself.
7. **Never delete the "Workers Builds" API token** in Cloudflare (all builds fail afterwards).
8. Verify for real before saying "done": `npm run check`, both builds, `wrangler dev`, live curl / Site monitor.

## Environment quirks (Windows corporate laptop)

- Work in `C:\Users\george.lincu\dermi.ro` (outside OneDrive). geoli reference clone: `C:\Users\george.lincu\ref-geoli`.
- `gh` is at `"C:\Program Files/GitHub CLI/gh.exe"`. `git push` may hang on a hidden credential prompt — use
  `git -c credential.helper= -c "credential.helper=!'/c/Program Files/GitHub CLI/gh.exe' auth git-credential" push`.
- Netskope intercepts TLS: `curl --ssl-no-revoke`; `NODE_TLS_REJECT_UNAUTHORIZED=0` only for one-off wrangler
  API calls. **Netskope shows its own 403 page for dermi.ro HTML** on this laptop — check the live site with
  WebFetch or the GitHub "Site monitor" workflow instead.
- Bash heredocs with complex quoting fail: write scripts to files (scratchpad) and run them. In Python
  replacement strings, `\b` and `\d` get mangled — prefer the Edit tool for regex-heavy code.
- Screenshots: headless Edge (`msedge.exe --headless=new --screenshot=…`, absolute long paths, poll for the file).
  Edge has a minimum window width (~500 px); for 320 px checks use the Browser pane with `resize_window`.
- `wrangler dev` rewrites the request host to dermi.ro (custom-domain routes) → for vault tests with
  `DEV_EMAIL` use `--local-upstream 127.0.0.1:<port>` (`npm run preview` already does).
- Stop only this project's wrangler processes (command line contains `george.lincu\dermi.ro\node_modules`);
  geoli sessions run their own wrangler on port 8788.
- The Claude Code **auto-mode classifier blocks Cloudflare DNS changes**; George switches the session to
  Manual mode for those.
- PowerShell `.ps1` scripts are blocked by execution policy; use `powershell -NoProfile -Command …` or the
  PowerShell tool (System.Drawing works for image resizing).

## Architecture

```
Astro 7 static build (dist/) ──► Cloudflare Worker "dermi" (static assets) ──► dermi.ro, www → 301 apex
                                  └─ Worker code only for /api/*, /vault*, /s/*, /media/* (run_worker_first)
Workers Builds: every merge to main deploys in ~1–2 min; /version.json shows the live commit.
```

| Path | What |
|---|---|
| `src/content/blog/*.md` | articles; schema in `src/content.config.ts` (title, description 50–170, pubDate, updatedDate, category, tags, draft, image, imageAlt, faq[], sources[]) |
| `src/lib/categories.ts` | topics: afectiuni, estetica, ingrediente, protectie-solara, rutine, consultatii (venereology was removed) |
| `src/config.ts` | doctor facts, e-mail, booking URL (empty fields are hidden) |
| `src/data/profile.ts` | CV from the doctor's synopsis (education, memberships, courses, statement, essay) |
| `src/lib/seo.ts` | JSON-LD (Person with alumniOf/memberOf/affiliation/identifier, BlogPosting, BreadcrumbList, FAQPage, CollectionPage) |
| `src/lib/agents.ts` | llms.txt, llms-full.txt, /index.md, /blog/<slug>.md |
| `src/i18n/ui.ts` | UI strings RO/EN and RO↔EN page pairs (EN core pages only; articles are Romanian) |
| `worker/` | `index.ts` router, `auth.ts` (Access JWT, fails closed), `share.ts` (HMAC links), `posts.ts` (GitHub Contents API, validation, claim warnings), `ui.ts` (vault UI, Romanian), `contact.ts` (form → Email Routing) |
| `public/_headers`, `public/_redirects` | security headers/CSP, caching; redirects (old Jekyll URLs are added by postbuild) |
| `scripts/postbuild.mjs` | [TODO] guard, unlink links to drafts, image lazy/size, Markdown header rules, old-URL redirects |
| `scripts/og-images.mjs` | `npm run og` — 1200×630 cards + icons via headless Edge |
| `.github/workflows/` | `ci.yml` (check, build, inline-code guard, repo-file guard, Lighthouse ≥ 0.95 mobile, drafts build), `monitor.yml` (hourly live check, auto issue) |
| `docs/` | VAULT, CLOUDFLARE-SETUP, CONTENT-GUIDE, REVIEW-ARTICOLE (RO), STRATEGIE (RO), IMAGE-RIGHTS, STATUS |

Hard constraints: CSP has no `unsafe-inline` — no inline `<script>`, `<style>` or `style=""` anywhere
(Astro `inlineStylesheets: 'never'`, `assetsInlineLimit: 0`, Prism). Astro 7's default Markdown processor
doesn't run remark/rehype plugins (would need `@astrojs/markdown-remark`) — do HTML post-processing in postbuild.

## Cloudflare resources (account shared with geoli.eu)

Worker `dermi` · R2 bucket `dermi-vault` (WEUR) · Zero Trust team `plain-block-9dbd.cloudflareaccess.com`,
Access app **Dermi Vault** (`dermi.ro/vault`, `www.dermi.ro/vault`, OTP only, 24 h, policy = the two admins;
AUD in `wrangler.jsonc`) · Email Routing `contact@dermi.ro` → drmadalinalincu@gmail.com · send_email binding
locked to that address · WAF custom rules, Free Managed Ruleset, rate limit 40/10 s · DNSSEC active (DS at RoTLD)
· CAA · AI bots allowed, managed robots.txt off. Details: `docs/CLOUDFLARE-SETUP.md`.

## Commands

```bash
npm run dev            # http://localhost:4321, drafts visible
npm run check          # astro check + tsc -p worker
npm run build          # production build (drafts excluded)
PREVIEW_DRAFTS=1 npm run build
npm run preview        # build + wrangler dev (copy .dev.vars.example to .dev.vars first)
npm run og             # social cards for new articles
```
