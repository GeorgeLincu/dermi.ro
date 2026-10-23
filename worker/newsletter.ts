// Newsletter sign-up → Brevo double opt-in (EU provider). No third-party script on the site: the form posts
// here, and Brevo sends the confirmation e-mail. The address joins the list only after the visitor clicks the
// link; Brevo then redirects to /newsletter/confirmat/. Unsubscribing is the link in every newsletter.
//
// Spam protection: honeypot, minimum fill time, same-origin check, per-IP rate limit (shared binding).

export interface NewsletterEnv {
  BREVO_API_KEY?: string;          // secret — Brevo → SMTP & API → API keys
  BREVO_LIST_ID?: string;          // the "Newsletter dermi.ro" list id (number)
  BREVO_DOI_TEMPLATE_ID?: string;  // the double opt-in confirmation template id (number)
  CONTACT_LIMIT?: RateLimit;
}

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const MIN_FILL_MS = 2000;
const ALLOWED_ORIGINS = ['https://dermi.ro', 'https://www.dermi.ro'];
const CONFIRMED_URL = 'https://dermi.ro/newsletter/confirmat/';

type Result = { ok: true } | { ok: false; error: 'invalid' | 'consent' | 'origin' | 'rate' | 'send' | 'off' };

export async function handleSubscribe(request: Request, env: NewsletterEnv): Promise<Response> {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const result = await subscribe(request, env);

  if (wantsJson) {
    const status = result.ok ? 200 : result.error === 'rate' ? 429 : result.error === 'send' || result.error === 'off' ? 503 : 400;
    return Response.json(result, { status, headers: { 'Cache-Control': 'no-store' } });
  }
  // Without JavaScript: redirect to a static page
  const to = new URL(result.ok ? '/newsletter/verifica/' : '/newsletter/eroare/', request.url);
  return Response.redirect(to.href, 303);
}

async function subscribe(request: Request, env: NewsletterEnv): Promise<Result> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (!local && (!origin || !ALLOWED_ORIGINS.includes(origin))) return { ok: false, error: 'origin' };

  const listId = Number(env.BREVO_LIST_ID);
  const templateId = Number(env.BREVO_DOI_TEMPLATE_ID);
  if (!env.BREVO_API_KEY || !listId || !templateId) return { ok: false, error: 'off' };

  const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
  if (env.CONTACT_LIMIT) {
    const { success } = await env.CONTACT_LIMIT.limit({ key: `subscribe:${ip}` });
    if (!success) return { ok: false, error: 'rate' };
  }

  let form: FormData;
  try { form = await request.formData(); } catch { return { ok: false, error: 'invalid' }; }
  const field = (k: string, max: number) => String(form.get(k) ?? '').trim().slice(0, max);

  // Bots: honeypot filled, or (when JavaScript set the start time) implausibly fast — pretend success
  const started = Number(form.get('t')) || 0;
  if (field('website', 200) || (started && Date.now() - started < MIN_FILL_MS)) return { ok: true };

  const email = field('email', 200).toLowerCase();
  if (!EMAIL_RE.test(email) || /[\r\n]/.test(email)) return { ok: false, error: 'invalid' };
  if (field('consent', 10) !== 'da') return { ok: false, error: 'consent' };

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, includeListIds: [listId], templateId, redirectionUrl: CONFIRMED_URL }),
    });
    // 201 = confirmation e-mail sent; 204 = contact already known (we don't reveal which)
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({})) as { code?: string; message?: string };
    console.error('subscribe: Brevo', res.status, data.code ?? '', data.message ?? '');
    if (res.status === 400 && /email/i.test(data.message ?? '')) return { ok: false, error: 'invalid' };
    return { ok: false, error: 'send' };
  } catch (err) {
    console.error('subscribe: request failed', err instanceof Error ? err.message : err);
    return { ok: false, error: 'send' };
  }
}
