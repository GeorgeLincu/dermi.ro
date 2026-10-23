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

The double opt-in template must contain Brevo's confirmation link placeholder (`{{ doubleoptin }}`).

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
