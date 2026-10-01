# Vault — private area and article publishing

`https://dermi.ro/vault/` is the private area of the site: files (R2), time-limited share links and
the **article editor** that publishes to the live site from the browser.

## How it works

```
browser ──► Cloudflare Access (one-time PIN by e-mail, 24 h session)
        ──► Worker "dermi" (verifies the Access JWT itself: RS256 via JWKS, aud/iss/exp — fails closed)
             ├─ /vault/*        UI + API (files in R2 bucket "dermi-vault")
             ├─ /s/<token>      public share links, HMAC-SHA256 with SHARE_SECRET, 1 h – 30 days
             ├─ /media/*        public article images from R2 (immutable cache)
             └─ articles        GitHub Contents API → commit to main → Workers Builds → live in ~1–2 min
```

The Worker runs only for `/api/*`, `/vault`, `/vault/*`, `/s/*`, `/media/*` (`run_worker_first`);
everything else is static.

## Users and roles

| Who | Role | Can |
|---|---|---|
| drmadalinalincu@gmail.com | admin | everything: files, share links, write/publish/delete articles |
| george.lincu@gmail.com | admin | everything |
| `EDITOR_EMAILS` (none yet) | editor | write, edit, publish, unpublish articles, add images; files view-only; no deleting articles, no uploads/deletes of files, no share links, no other people's `people/` folders |

A person must be in **both** the Access policy ("Dermi Vault" application) **and** `ADMIN_EMAILS` /
`EDITOR_EMAILS` in `wrangler.jsonc`. Anyone signed in but not listed is a guest (view files only,
own `people/<email>/` folder).

## Article editor

- List with filter (all / drafts / published); "TODO" marks drafts that still have placeholders.
- Fields mirror the content schema (`src/content.config.ts`): title, URL slug (Romanian-safe:
  ș→s, ț→t, ă/â→a, î→i), description (50–170, live counter), topic, tags, date, cover image + alt
  text, Markdown body with preview, FAQ (`Î:` / `R:` blocks) and sources (`Title | Publisher | URL`).
- Images are resized to max 1600 px and converted to WebP **in the browser**, uploaded to R2 at
  `/media/blog/<slug>/…-<width>x<height>.webp`; the build sets width/height/lazy loading from the name.
- **Draft** checkbox → Save draft / Publish / Update. Delete is admin-only.
- Every save is a commit to `main`: "Saved from dermi.ro/vault by <email>", with optimistic locking
  on the file sha (two people editing the same article cannot overwrite each other).
- Dates: publishing a draft dated in the future or past uses today; articles migrated from 2025 keep
  their original date and get "updated" = today. "Updated" is never earlier than the publish date.
- After publishing, the editor polls `/version.json` and shows **"Live acum ✓"** when the new build
  is live.
- Server-side validation mirrors the schema, rejects `<script>`, `<style>`, `style=""`, `on…=` and
  **refuses to publish text that still contains `[TODO`**.
- Warns (doesn't block) on claims EU cosmetics rules forbid for cosmetics (Reg. 1223/2009,
  Reg. 655/2013): „vindecă”, „elimină definitiv”, „dermatologic garantat”, „100% natural”,
  „fără chimicale”, „rezultate garantate”, „miraculos”.

## Files

Folders, drag-and-drop upload (admins), downloads with range support. `people/<email>/` folders are
private to that person. HTML/SVG and other active types are always served as downloads; files shown
inline get a sandbox CSP. Writes require a same-origin request; keys are traversal-safe.

## Setup checklist (Cloudflare)

1. **R2 bucket** `dermi-vault`, location hint **WEUR**.
2. **Zero Trust → Access → Applications → Add → Self-hosted**, name **Dermi Vault**:
   - domains `dermi.ro/vault` and `www.dermi.ro/vault` (path covers `/vault*`)
   - session duration **24 h**, HTTP-only cookie
   - policy **Allow** → emails: drmadalinalincu@gmail.com, george.lincu@gmail.com
   - copy the **Application Audience (AUD) Tag** into `ACCESS_AUD` in `wrangler.jsonc`
3. **Zero Trust → Settings → Authentication → One-time PIN** must be enabled.
4. **Worker dermi → Settings → Variables and Secrets** (type *Secret*):
   - `SHARE_SECRET` — random, ≥ 32 characters. Set it only after the Worker version using it is
     deployed (Cloudflare refuses secrets when the latest version isn't deployed).
   - `GITHUB_TOKEN` — fine-grained token, repository **GeorgeLincu/dermi.ro only**,
     permission **Contents: Read and write**, expiry 1 year. Renew before it expires.

## Local development

```bash
cp .dev.vars.example .dev.vars    # DEV_EMAIL works only on localhost
npm run preview                   # build + wrangler dev --local-upstream localhost:8787
```

To test publishing, set `GITHUB_BRANCH=vault-test` and a token in `.dev.vars`, create that branch
first, and delete it afterwards. Never test against `main`.
