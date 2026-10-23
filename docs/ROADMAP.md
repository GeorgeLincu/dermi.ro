# ROADMAP — next improvements (instructions for an AI assistant)

Prioritised backlog after the initial build (2026-10-24). Human version (Romanian): `docs/recomandari.html`.
Each item: **ID · owner (Owner = George/Dr. Mădălina, Claude = AI) · what · how · done when**.
Rules: read CLAUDE.md first; one small PR per item; never push to main; never invent medical content.

## P0 — now (security / continuity)

- **S1 · Owner · Renew the geoli.eu GitHub token (expires 2026-10-30).** The geoli Worker still uses the old
  token (`.secrets/github-publishing-token.txt`). GitHub → fine-grained token → Regenerate (1 year) → geoli Worker
  secret `GITHUB_TOKEN` + local file. Done when the header `github-authentication-token-expiration` shows ≥ 2027.
- **S2 · Owner · 2FA/passkeys** on GitHub, Cloudflare, both Gmail accounts, Brevo, RoTLD; recovery codes stored offline.
- **S3 · Owner · Domain**: check dermi.ro expiry in the RoTLD account, enable auto-renew/registrar lock; then
  Claude fills the `[TODO]` row in docs/STATUS.md.
- **S4 · Claude (Manual mode) · DMARC**: after ~2 newsletters, change `_dmarc` TXT from `p=none` to
  `v=DMARC1; p=quarantine; adkim=s; aspf=s; rua=mailto:rua@dmarc.brevo.com`, 2–4 weeks later `p=reject`.
  Check first that contact-form mail (formular@dermi.ro via Cloudflare) and Brevo mail pass DKIM (Gmail → Show original).
- **S5 · Owner · HSTS preload**: submit dermi.ro at hstspreload.org (header already `max-age=63072000; includeSubDomains; preload`).

## P1 — this month (content and visibility)

- **C1 · Owner · Publish the first 5 articles** (acneea-la-adulti, alunite-semne-de-alarma,
  cum-aplici-corect-protectia-solara, dermatita-atopica, caderea-parului-la-femei) after medical review
  (`docs/REVIEW-ARTICOLE.md`); then 2 per month. Delete the `testingarticle` draft from the vault.
- **C2 · Claude · `reviewedDate` field**: add optional `reviewedDate` to the schema (src/content.config.ts +
  worker/posts.ts validate/serialize + vault UI), render "Revizuit medical la …", JSON-LD `lastReviewed` +
  `reviewedBy` (personRef). Only when the doctor actually reviewed.
- **V1 · Owner · Google Search Console**: Domain property is verified (TXT present) → submit `/sitemap.xml`;
  Bing Webmaster Tools → import from GSC. Cloudflare: turn on Web Analytics (automatic) and Crawler Hints.
- **V2 · Owner · Clinic listing**: ask Dr. Leventer Centre to list Dr. Lincu on their team page with a link to
  dermi.ro and to add her to their Google Business Profile(s) (strongest local-SEO and trust signal).
- **V3 · Owner · Booking**: get the clinic's booking URL → Claude sets `CONFIG.bookingUrl` (button appears
  site-wide). If the site then promotes her services: add PFI name, CIF, professional address on /legal/ (Legea 365/2002).
- **N1 · Owner · Newsletter launch**: send the Brevo draft "Lansare dermi.ro" after C1; monthly drafts arrive
  automatically (GitHub issue label `newsletter`).

## P2 — next quarter (product)

- **P1 · Claude · Vault editor**: highlight `[TODO` lines; "ready for review" status; scheduled publishing
  (publish at date via a daily GitHub Action that flips `draft` when `pubDate <= today` and `scheduled: true`).
- **P2 · Claude · Site search** once ≥ 20 published articles: build-time index (e.g. Pagefind), self-hosted
  JS/CSS, no inline code (CSP), works offline of third parties.
- **P3 · Claude · Turnstile** on contact/newsletter forms only if spam appears (CSP: add
  challenges.cloudflare.com to script-src/frame-src; verify token in the Worker).
- **P4 · Claude · OG cards in CI**: regenerate missing `/assets/og/<slug>.png` in a workflow (Chromium on
  ubuntu-latest) so vault-published articles get proper social images.
- **P5 · Claude · Monthly backup workflow**: export R2 `dermi-vault` (rclone, scoped R2 token as GitHub
  secret set by the owner) and Brevo contacts CSV to an encrypted artifact; keep 3 months.
- **P6 · Claude · Monitor extras**: alert when the Brevo DOI template is inactive or missing the `optin` tag
  (needs `BREVO_API_KEY` repo secret, already present); weekly Lighthouse on production.

## P3 — later

- **L1 · English versions** of the 5 most-read articles (real `/en/blog/` pages + hreflang), only if analytics
  show non-Romanian readers.
- **L2 · Original photography** (with written consent where people are identifiable), logged in
  docs/IMAGE-RIGHTS.md; cover images via the vault (WebP).
- **L3 · Affiliate/product recommendations or online consultations**: only after written confirmation from CMR
  and a lawyer; separate, clearly labelled pages; update /legal/ and the privacy policy the same day.
- **L4 · Video**: short Reels/TikTok/Shorts per article with a link back (owner).

## Recurring

- Monthly: merge Dependabot PRs (CI must be green); review the newsletter draft issue; check the Site monitor.
- Quarterly: re-read docs/STATUS.md credentials table; update `src/data/locations.ts` if hours change
  (also the `WEEK` table in scripts/brevo-setup-content.mjs, then re-run it); review the privacy policy.
- Yearly: rotate tokens without expiry; extend `security.txt` `Expires` (the monitor warns 30 days ahead).
