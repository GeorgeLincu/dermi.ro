# Project status — dermi.ro

Last updated: 2026-10-01 (end of the initial build). Update this file whenever a phase item changes.

## Snapshot

- **Live** at https://dermi.ro on the Cloudflare Worker `dermi`; Site monitor (hourly) green.
- **0 articles published, 43 drafts** + 1 test draft (`testingarticle` — delete it from the vault).
  The homepage shows "Primele articole sunt în pregătire" until the doctor publishes.
- Vault at https://dermi.ro/vault/ works end to end (login, files, share links, article editor, publishing).
- Contact form and `contact@dermi.ro` deliver to drmadalinalincu@gmail.com (tested by George).

## What was built (PRs on GeorgeLincu/dermi.ro)

| PR | What |
|---|---|
| #1 | Jekyll → Astro 7 on Cloudflare Workers; new design (porcelain/botanical green/clay, Fraunces + Figtree self-hosted, light/dark, 320 px); 39 draft articles (30 new + 9 old rewritten); old URL redirects; JSON-LD, sitemap/hreflang, RSS, llms.txt, Markdown twins, OG cards; strict CSP; legal + GDPR pages; CI with Lighthouse ≥ 0.95. Brand: der·mi wordmark and "mi" seal |
| #2 | Contact form via Worker + Cloudflare Email Routing (honeypot, timing, Origin check, 5/min/IP) |
| #3 | Custom domains dermi.ro + www on the Worker (DNS moved off GitHub Pages; www → apex Redirect Rule) |
| #4 | Deploy notes; first automatic build after connecting Workers Builds |
| #5 | Vault (Phase 5): Access JWT auth, R2 files, share links, Romanian article editor (topic, tags, cover, FAQ, sources, WebP conversion, [TODO] block, claim warnings, "Live acum ✓") |
| #6, #8 | Hourly Site monitor (auto issue), docs/CLOUDFLARE-SETUP.md, docs/IMAGE-RIGHTS.md |
| #9 | Venereology topic removed (4 STI drafts deleted, in Git history) → **Dermatologie estetică** + 8 drafts; links to drafts render as plain text; docs/STRATEGIE.md |
| #10 | About page with the real CV (from the doctor's synopsis), portrait, CMR code; credentials in JSON-LD and llms.txt |
| #11 | Workplace: collaborator at Dr. Leventer Centre (JSON-LD `affiliation`), legal notice with CMR membership |

Outside the repo (via API/dashboard): SSL Full (strict), TLS ≥ 1.2, Always HTTPS, Email Obfuscation off,
Early Hints on; WAF custom rules, Free Managed Ruleset, rate limit; AI bot blocking off + managed robots.txt off;
CAA; DNSSEC (DS added at RoTLD, active); Email Routing (Zoho removed); R2 bucket; Access app; GitHub:
Dependabot alerts + security updates, private vulnerability reporting, secret scanning + push protection,
branch protection on main, delete-branch-on-merge; GitHub Pages disabled.

## Open items

### Owner (George / Dr. Mădălina)
- [ ] **Review and publish articles** — start with acneea-la-adulti, alunite-semne-de-alarma,
      cum-aplici-corect-protectia-solara, dermatita-atopica, caderea-parului-la-femei. Checklist:
      `docs/REVIEW-ARTICOLE.md` (medical points and `[TODO: verifică …]` per article).
- [ ] **Renew the Cloudflare API token before 2026-10-31** (local file used by Claude for API work).
- [ ] **DMARC**: check DKIM of a contact-form e-mail (Gmail web → ⋮ → Show original) → then publish
      `_dmarc` TXT. Plan: `v=DMARC1; p=reject; adkim=s; aspf=s` if DKIM passes for dermi.ro; otherwise start with
      `p=none`. Needs Manual mode (DNS change).
- [ ] Google Search Console (Domain property, verify via Cloudflare, submit `/sitemap.xml`), then Bing Webmaster
      Tools → import from GSC.
- [ ] Cloudflare: Web Analytics (automatic setup — the privacy policy already mentions it) and Crawler Hints
      (Caching → Configuration). The API token lacks permission for both.
- [ ] Booking link + names of the two Dr. Leventer Centre locations → `src/config.ts` `bookingUrl` (button appears).
      If the site promotes her services: add PFI name, CIF and professional address to the legal page (Legea 365/2002).
- [ ] Separate fine-grained GitHub token for dermi.ro (the vault currently uses the token shared with geoli).
- [ ] Photographer's consent for the portrait (see `docs/IMAGE-RIGHTS.md`).
- [ ] 2FA/passkeys on GitHub, Cloudflare, both Gmail accounts, RoTLD; domain auto-renew.
- [ ] Ask IT to unblock dermi.ro in Netskope (only affects the work laptop).
- [ ] Before affiliate links, product recommendations or online consultations: confirm with CMR / a lawyer.

### Claude (when asked)
- [ ] DMARC record (after the DKIM check), in Manual mode.
- [ ] Booking button, locations (and `MedicalClinic`/`Place` JSON-LD) once the owner provides them.
- [ ] Update `src/data/profile.ts` when the CV changes; keep `docs/CLOUDFLARE-SETUP.md` accurate.

## Suggested improvements (not started)

**Content & visibility** (details in `docs/STRATEGIE.md`)
- Publish 2 reviewed articles per month; build topic clusters with internal links.
- A "Revizuit medical de … la data …" line once the doctor reviews (add a `reviewedDate` field to the schema,
  render it, and add `lastReviewed`/`reviewedBy` to JSON-LD — only for real reviews).
- Short videos (Reels/TikTok/Shorts) linking to articles; Google Business Profile for the practice.
- English article translations only if there is a real audience (real `/en/blog/` pages with hreflang).

**Product / tech**
- Vault: highlight `[TODO` lines in the editor; a "ready for review" status; scheduled publishing.
- Vault preview with the real site styles (currently a simplified preview).
- Contact form: add Cloudflare Turnstile only if spam appears (needs CSP update for challenges.cloudflare.com).
- Site search (static, e.g. Pagefind-style index) once there are 20+ published articles.
- Monthly R2 backup (rclone with a scoped R2 token stored as a GitHub secret by the owner).
- Re-run `npm run og` after title changes (`--force`), or generate OG cards in CI.
- Newsletter later: double opt-in, GDPR-compliant provider, update CSP and privacy policy first.

## How to verify everything is fine

1. GitHub → Actions → **Site monitor** green (or run it: `gh workflow run monitor.yml`).
2. `https://dermi.ro/version.json` shows the latest `main` commit.
3. Locally: `npm run check` (0 errors), `npm run build`, `PREVIEW_DRAFTS=1 npm run build`.
