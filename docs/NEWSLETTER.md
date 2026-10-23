# Newsletter (Brevo, double opt-in)

## How it works

```
form (article end, homepage, /newsletter/) ──POST /api/subscribe──► Worker (worker/newsletter.ts)
   honeypot · timing · Origin check · rate limit · consent checkbox required
                                      └──► Brevo API /v3/contacts/doubleOptinConfirmation
Brevo e-mails the confirmation link ──► visitor clicks ──► added to the list ──► /newsletter/confirmat/
```

- No third-party script on the site; the CSP is unchanged. Without JavaScript the form still works
  (303 → `/newsletter/verifica/` or `/newsletter/eroare/`).
- The form, the footer link, the homepage block, the article-end block and the sitemap entry appear only
  when `newsletter: true` in `src/config.ts`. The privacy policy's newsletter section appears with it.
- The Worker answers `off` (503) until `BREVO_API_KEY`, `BREVO_LIST_ID` and `BREVO_DOI_TEMPLATE_ID` are set.

## Configuration

| What | Where |
|---|---|
| `BREVO_API_KEY` | Worker → Settings → Variables and Secrets, type **Secret** |
| `BREVO_LIST_ID` | `wrangler.jsonc` `vars` — **3** ("Newsletter dermi.ro") |
| `BREVO_DOI_TEMPLATE_ID` | `wrangler.jsonc` `vars` — **1** ("DOI dermi.ro", must stay *active*) |
| Redirect after confirmation | `https://dermi.ro/newsletter/confirmat/` (fixed in the Worker) |
| Sender | `Dr. Mădălina Lincu - dermi.ro <contact@dermi.ro>` (sender id 2; domain authenticated, DKIM brevo1/brevo2, branded links `news.dermi.ro`) |
| Brevo API key (local, for Claude) | `C:\Users\george.lincu\.secrets\brevo-api-key.txt` — never print it |

The double opt-in template must contain Brevo's confirmation link placeholder (`{{ doubleoptin }}`),
be **active**, and carry the tag **`optin`** — otherwise Brevo answers "An active DOI template does not
exist" and the site shows "Abonarea nu a reușit". Templates made in the Brevo editor don't get the tag; set it
via the API (`PUT /v3/smtp/templates/1` with `{"tag":"optin"}`).

Tested end to end on 2026-10-23: sign-up → confirmation e-mail → /newsletter/confirmat/ → contact in list 3.

## Rules for every campaign

- At most monthly; educational content only (new/updated articles). No offers, no product promotion,
  no prescription-medicine content (CMR deontology; see docs/CONTENT-GUIDE.md).
- One general list. **Never segment by condition** (that would reveal health data).
- Brevo adds the unsubscribe link and the sender's postal footer automatically — keep them.
- Send from Brevo to the list; test first by sending to yourself.

## Monthly campaign (owner)

1. Brevo → Campaigns → Create an email campaign → name "dermi.ro – <lună an>".
2. Recipients: the newsletter list. Sender: contact@dermi.ro. Subject: e.g. "Noutăți pe dermi.ro: <tema>".
3. Content: 2–4 new articles — title, one sentence, link to `https://dermi.ro/blog/<slug>/`.
4. Send a test to yourself, check links on phone, then schedule.

## Automations

| What | How | Where |
|---|---|---|
| Double opt-in e-mail | Brevo template **1** "DOI dermi.ro" (tag `optin`) | sent by Brevo on sign-up |
| Welcome e-mail | Brevo template **2** "Bun venit dermi.ro" + a Brevo automation (trigger: contact added to list 3) | Brevo → Automations |
| Monthly draft | `.github/workflows/newsletter-draft.yml` on the 1st at 07:00 UTC → `scripts/newsletter-draft.mjs` reads the live RSS, creates the draft "dermi.ro – <lună an>" with last month's articles, opens a GitHub issue (label `newsletter`) | needs repo secret `BREVO_API_KEY` |
| Launch campaign | draft "Lansare dermi.ro" (campaign id 3), created by `scripts/brevo-setup-content.mjs` | Brevo → Campaigns |

Nothing is ever sent to subscribers automatically except the confirmation and welcome e-mails.

- Re-run `BREVO_API_KEY=… node scripts/brevo-setup-content.mjs` after changing the welcome/launch texts or
  the consulting schedule (its `WEEK` table must match `src/data/locations.ts`). `--dry-run` writes HTML files.
- Test the monthly draft without creating anything: `node scripts/newsletter-draft.mjs 2026-11 --dry-run`.
- E-mail HTML lives in `scripts/lib/email-layout.mjs` (inline styles and tables — normal for e-mail clients).
