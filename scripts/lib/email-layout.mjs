// Shared HTML layout for dermi.ro e-mails (Brevo campaigns and templates).
// E-mail clients need inline styles and tables; this is NOT site HTML (the site's CSP doesn't apply).

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const C = { bg: '#f8f4ee', card: '#fffdf9', line: '#e2d8ca', ink: '#1b2622', soft: '#33403b', muted: '#5a6560', green: '#2d5a4d', clay: '#9f4b2b' };
const SANS = "'Segoe UI',Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

export const p = html => `<p style="margin:0 0 14px;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.soft};">${html}</p>`;
export const h2 = text => `<h2 style="margin:26px 0 12px;font-family:${SERIF};font-weight:normal;font-size:22px;line-height:1.3;color:${C.ink};">${esc(text)}</h2>`;
export const button = (href, text) =>
  `<p style="margin:22px 0;"><a href="${esc(href)}" style="display:inline-block;background:${C.green};color:#ffffff;font-family:${SANS};font-size:16px;font-weight:bold;text-decoration:none;padding:13px 26px;border-radius:999px;">${esc(text)}</a></p>`;
export const link = (href, text) => `<a href="${esc(href)}" style="color:${C.green};">${esc(text)}</a>`;

/** One article teaser: title (linked), one-line description, "Citește articolul →" */
export const article = ({ title, url, description }) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border:1px solid ${C.line};border-radius:12px;">
  <tr><td style="padding:16px 18px;">
    <a href="${esc(url)}" style="font-family:${SERIF};font-size:19px;line-height:1.3;color:${C.ink};text-decoration:none;">${esc(title)}</a>
    <p style="margin:6px 0 10px;font-family:${SANS};font-size:15px;line-height:1.55;color:${C.muted};">${esc(description)}</p>
    <a href="${esc(url)}" style="font-family:${SANS};font-size:14px;font-weight:bold;color:${C.green};text-decoration:none;">Citește articolul →</a>
  </td></tr>
</table>`;

/** Weekly consulting schedule block (rows: [day, hours, place]) */
export const schedule = rows => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;font-family:${SANS};font-size:15px;color:${C.soft};">
${rows.map(([d, h, place]) => `  <tr><td style="padding:6px 0;font-weight:bold;width:32%;">${esc(d)}</td><td style="padding:6px 0;width:28%;">${esc(h)}</td><td style="padding:6px 0;">${esc(place)}</td></tr>`).join('\n')}
</table>`;

/** Full e-mail document */
export function layout({ title, preheader = '', body, marketing = false }) {
  // Brevo replaces {{ unsubscribe }} with the subscriber's personal unsubscribe link (campaigns/automations only)
  const unsubscribe = marketing
    ? `<br>Primești acest e-mail pentru că te-ai abonat la newsletterul dermi.ro. <a href="{{ unsubscribe }}" style="color:${C.green};">Dezabonare</a>`
    : '';
  return `<!doctype html>
<html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:16px;">
    <tr><td style="padding:28px 36px 0;"><a href="https://dermi.ro/" style="text-decoration:none;"><img src="https://dermi.ro/assets/email/logo-dermi.png" width="116" height="51" alt="dermi" style="display:block;border:0;width:116px;height:51px;font-family:${SERIF};font-size:28px;color:${C.ink};"></a></td></tr>
    <tr><td style="padding:18px 36px 8px;">${body}</td></tr>
    <tr><td style="padding:18px 36px 26px;border-top:1px solid ${C.line};font-family:${SANS};font-size:13px;line-height:1.55;color:${C.muted};">
      Dr. Mădălina Iulia Lincu, medic specialist dermatovenerolog · ${link('https://dermi.ro/', 'dermi.ro')}<br>
      Conținutul are scop informativ și nu înlocuiește consultul medical. Nu răspundem la întrebări medicale prin e-mail.${unsubscribe}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}
