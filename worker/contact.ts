// Contact form → e-mail to the doctor, sent by Cloudflare Email Routing (no third-party form service).
//
// The send_email binding in wrangler.jsonc is locked to ONE verified destination address, so this code
// cannot be abused to send mail anywhere else. Spam protection: honeypot field, minimum fill time,
// same-origin check and a per-IP rate limit.
import { EmailMessage } from 'cloudflare:email';

export interface ContactEnv {
  MAILER: SendEmail;
  CONTACT_LIMIT?: RateLimit;
  CONTACT_FROM?: string; // sender on our domain, default formular@dermi.ro
  CONTACT_TO?: string;   // must equal destination_address of the MAILER binding
}

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const MIN_FILL_MS = 3000;
const TOPICS: Record<string, string> = {
  site: 'Întrebare despre site',
  colaborare: 'Colaborare / presă',
  corectura: 'Corectură la un articol',
  altceva: 'Altceva',
};
const ALLOWED_ORIGINS = ['https://dermi.ro', 'https://www.dermi.ro'];

type Result = { ok: true } | { ok: false; error: 'invalid' | 'origin' | 'rate' | 'send' };

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const lang = new URL(request.url).searchParams.get('lang') === 'en' ? 'en' : 'ro';
  const result = await process(request, env);

  if (wantsJson) {
    const status = result.ok ? 200 : result.error === 'rate' ? 429 : result.error === 'send' ? 502 : 400;
    return Response.json(result, { status, headers: { 'Cache-Control': 'no-store' } });
  }
  // Without JavaScript: plain form post → redirect to a static confirmation/error page
  const base = lang === 'en' ? '/en/contact/' : '/contact/';
  const to = new URL(result.ok ? `${base}trimis/` : `${base}eroare/`, request.url);
  return Response.redirect(to.href, 303);
}

async function process(request: Request, env: ContactEnv): Promise<Result> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (!local && (!origin || !ALLOWED_ORIGINS.includes(origin))) return { ok: false, error: 'origin' };

  const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
  if (env.CONTACT_LIMIT) {
    const { success } = await env.CONTACT_LIMIT.limit({ key: `contact:${ip}` });
    if (!success) return { ok: false, error: 'rate' };
  }

  let form: FormData;
  try { form = await request.formData(); } catch { return { ok: false, error: 'invalid' }; }
  const field = (k: string, max: number) => String(form.get(k) ?? '').trim().slice(0, max);

  // Bots: honeypot filled, or (when JavaScript set the start time) implausibly fast — pretend success, send nothing
  const started = Number(form.get('t')) || 0;
  if (field('website', 200) || (started && Date.now() - started < MIN_FILL_MS)) return { ok: true };

  const name    = field('name', 100).replace(/[\r\n]+/g, ' ');
  const email   = field('email', 200);
  const topic   = TOPICS[field('topic', 20)] ?? TOPICS.altceva;
  const message = field('message', 5000);
  if (!name || !EMAIL_RE.test(email) || /[\r\n]/.test(email) || message.length < 10) return { ok: false, error: 'invalid' };

  const from = env.CONTACT_FROM ?? 'formular@dermi.ro';
  const to   = env.CONTACT_TO ?? 'drmadalinalincu@gmail.com';
  const body = [
    `Mesaj nou trimis prin formularul de pe dermi.ro`,
    ``,
    `Nume:    ${name}`,
    `E-mail:  ${email}`,
    `Subiect: ${topic}`,
    ``,
    message,
    ``,
    `—`,
    `Răspunde direct la acest e-mail (Reply-To este adresa expeditorului).`,
    `Atenție: nu oferi diagnostic sau tratament prin e-mail.`,
  ].join('\r\n');

  const raw = mime({
    from: `"Formular dermi.ro" <${from}>`,
    to: `<${to}>`,
    replyTo: `${encodeWord(name)} <${email}>`,
    subject: `[dermi.ro] ${topic} — ${name}`,
    body,
  });

  try {
    // The binding only accepts its configured destination_address — CONTACT_TO must match it
    await env.MAILER.send(new EmailMessage(from, to, raw));
    return { ok: true };
  } catch (err) {
    console.error('contact: send failed', err instanceof Error ? err.message : err);
    return { ok: false, error: 'send' };
  }
}

// RFC 2047 encoded-word for non-ASCII header text (names, subject)
const encodeWord = (s: string) =>
  /^[\x20-\x7e]*$/.test(s) ? `"${s.replace(/["\\]/g, '')}"` : `=?UTF-8?B?${b64(s)}?=`;

function b64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function mime(m: { from: string; to: string; replyTo: string; subject: string; body: string }): string {
  const id = `<${crypto.randomUUID()}@dermi.ro>`;
  const wrapped = b64(m.body).replace(/.{1,76}/g, '$&\r\n');
  return [
    `From: ${m.from}`,
    `To: ${m.to}`,
    `Reply-To: ${m.replyTo}`,
    `Subject: =?UTF-8?B?${b64(m.subject)}?=`,
    `Message-ID: ${id}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapped,
  ].join('\r\n');
}
