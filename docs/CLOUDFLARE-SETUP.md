# Cloudflare setup (dermi.ro)

Everything runs on Cloudflare's free plan; the domain (registrar: Hostinger) is the only cost.
State as configured on 2026-10-01. Keep this file accurate when something changes.

## Worker and deploys

- Worker **`dermi`**, static assets from `./dist`, Worker code only for `/api/*`, `/vault*`, `/s/*`, `/media/*`.
- **Workers Builds** is connected to `GeorgeLincu/dermi.ro`, branch `main`, deploy command
  `npx wrangler deploy`, non-production branch builds **off**. Every merge to `main` is live in ~1–2 min;
  `https://dermi.ro/version.json` shows the live commit.
- **Never delete the "Workers Builds" API token** (My Profile → API Tokens). Builds fail afterwards
  ("build token deleted or rolled").
- Custom domains `dermi.ro` and `www.dermi.ro` are attached to the Worker (`routes` in `wrangler.jsonc`).
  `workers_dev` and preview URLs are off.
- Bindings: R2 `VAULT` → bucket `dermi-vault` (WEUR), `send_email` `MAILER` → drmadalinalincu@gmail.com,
  rate limit `CONTACT_LIMIT` (5/min/IP). Secrets: `SHARE_SECRET`, `GITHUB_TOKEN` (see docs/VAULT.md).

## DNS and e-mail

| Record | Purpose |
|---|---|
| `dermi.ro`, `www` (Worker custom domains, proxied) | the site |
| MX `route1/2/3.mx.cloudflare.net`, TXT SPF `include:_spf.mx.cloudflare.net`, DKIM `cf2024-1._domainkey` | Cloudflare Email Routing |
| `_dmarc` TXT | DMARC (see below) |
| CAA | which CAs may issue certificates (see below) |

- **Email Routing**: `contact@dermi.ro` → drmadalinalincu@gmail.com (verified destination). Every other
  address is dropped. The contact form sends from `formular@dermi.ro` through the Worker.
- Zoho Mail was removed on 2026-10-01 (its MX/SPF/DKIM records are gone).
- The site shows only `contact@dermi.ro`, never the Gmail address.

## TLS

SSL mode **Full (strict)**, minimum TLS **1.2**, TLS 1.3 on, **Always Use HTTPS**, HSTS 2 years with
`includeSubDomains; preload` (sent by the site in `public/_headers`).

## Security rules

- **WAF custom rules** (Security → WAF → Custom rules):
  1. Block scanner paths (`/.git`, `/.env`, `wp-*`, `xmlrpc`, `phpmyadmin`, `*.php`, `*.asp(x)`,
     `*.sql`, `*.bak`, `/cgi-bin`).
  2. Only GET/HEAD/OPTIONS, except `/vault/*`, `/cdn-cgi/*` and `POST /api/contact`.
  3. Block Bytespider.
- **Cloudflare Managed Free Ruleset**: deployed.
- **Rate limiting**: `/vault/api/*`, `/s/*`, `/api/*` → 40 requests / 10 s per IP, then blocked for 10 s.
- **Email Obfuscation off** (it injects inline JavaScript, which the CSP blocks); Rocket Loader off;
  Browser Integrity Check on; Early Hints on.
- **www → apex**: Redirect Rule `www.dermi.ro/*` → `https://dermi.ro/*` (301, keeps path and query).

## Zero Trust (login for /vault)

- Team domain `plain-block-9dbd.cloudflareaccess.com` (shared with geoli.eu).
- Application **Dermi Vault**: `dermi.ro/vault` and `www.dermi.ro/vault`, session 24 h, HTTP-only
  cookie, login method **One-time PIN** only, policy "Dermi admins" = drmadalinalincu@gmail.com,
  george.lincu@gmail.com. Its AUD tag is `ACCESS_AUD` in `wrangler.jsonc`.

## Crawlers, SEO and analytics

- **AI crawlers allowed** (Security → Bots / AI Crawl Control): AI bot blocking **off**, Cloudflare
  "managed robots.txt" **off** — the site serves its own `robots.txt` with
  `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. Bytespider is blocked by a WAF rule.
- **Crawler Hints** (IndexNow): Caching → Configuration → Crawler Hints → On.
- **Web Analytics** (cookie-free): Analytics & Logs → Web Analytics → Add site `dermi.ro` →
  automatic setup. The CSP already allows `static.cloudflareinsights.com` / `cloudflareinsights.com`.

## Still to do by the owner (needs the dashboard or the registrar)

- [ ] **DNSSEC**: DNS → Settings → Enable DNSSEC, then add the DS record at Hostinger
      (flags 257, algorithm 13, protocol 3, public key from Cloudflare).
- [ ] Crawler Hints and Web Analytics (the API token has no permission for these).
- [ ] Registrar lock + auto-renew for dermi.ro at Hostinger; 2FA/passkeys on Cloudflare, GitHub,
      Gmail and Hostinger.

## API token

The local token (`C:\Users\george.lincu\.secrets\cloudflare-token.txt`) covers geoli.eu and dermi.ro and
**expires on 2026-10-31** — renew it before then (My Profile → API Tokens → the token → Roll / extend TTL).
