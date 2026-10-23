// Monthly newsletter DRAFT in Brevo from the articles published (or updated) last month.
// Run by .github/workflows/newsletter-draft.yml on the 1st of each month; the doctor reviews and sends it
// from Brevo — nothing is ever sent automatically.
//
//   BREVO_API_KEY=… node scripts/newsletter-draft.mjs            previous calendar month
//   BREVO_API_KEY=… node scripts/newsletter-draft.mjs 2026-11    a given month
//   node scripts/newsletter-draft.mjs 2026-11 --dry-run           print the e-mail, create nothing
//
// Source of truth: the live RSS feed (published articles only). No articles that month → no draft.
import { writeFileSync } from 'node:fs';
import { layout, p, h2, article, button, link } from './lib/email-layout.mjs';

const SITE = 'https://dermi.ro';
const LIST_ID = 3;            // "Newsletter dermi.ro"
const SENDER_ID = 2;          // Dr. Mădălina Lincu - dermi.ro <contact@dermi.ro>
const MONTHS = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const monthArg = args.find(a => !a.startsWith('--'));
  if (monthArg && !/^\d{4}-(0[1-9]|1[0-2])$/.test(monthArg)) throw new Error(`Month must be YYYY-MM, got "${monthArg}"`);
  const now = new Date();
  const [year, month] = monthArg
    ? monthArg.split('-').map(Number)
    : [now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear(), now.getUTCMonth() === 0 ? 12 : now.getUTCMonth()];
  const label = `${MONTHS[month - 1]} ${year}`;
  const inMonth = d => d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;

  const decode = s => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
  const tag = (xml, t) => decode(xml.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1] ?? '');

  const res = await fetch(`${SITE}/rss.xml`, { headers: { 'User-Agent': 'dermi-newsletter-draft/1.0' } });
  if (!res.ok) throw new Error(`RSS: HTTP ${res.status}`);
  const items = [...(await res.text()).matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => ({
    title: tag(m[1], 'title'), url: tag(m[1], 'link'), description: tag(m[1], 'description'), date: new Date(tag(m[1], 'pubDate')),
  }));
  const fresh = items.filter(i => inMonth(i.date));

  if (!fresh.length) {
    console.log(`No articles published in ${label} — no draft created.`);
    return;
  }

  const subject = fresh.length === 1 ? `Nou pe dermi.ro: ${fresh[0].title}` : `Noutăți pe dermi.ro – ${label}`;
  const body = [
    p('Bună,'),
    p(fresh.length === 1
      ? `Luna aceasta am publicat un articol nou pe dermi.ro:`
      : `Iată articolele publicate luna aceasta pe dermi.ro:`),
    ...fresh.map(article),
    h2('Unde consult'),
    p(`Programul la Dr. Leventer Centre (Monetăriei 8 și Herăstrău 9, București) este pe ${link(`${SITE}/program/`, 'dermi.ro/program')}, cu hărți și indicații.`),
    button(`${SITE}/blog/`, 'Toate articolele'),
    p('Cu drag,<br>Dr. Mădălina Iulia Lincu'),
  ].join('\n');
  const html = layout({ marketing: true, title: subject, preheader: fresh.map(i => i.title).join(' · ').slice(0, 140), body });

  if (dryRun) {
    writeFileSync('newsletter-draft.html', html);
    console.log(`[dry run] ${fresh.length} article(s) for ${label}; subject "${subject}"; HTML written to newsletter-draft.html`);
    return;
  }

  const KEY = process.env.BREVO_API_KEY;
  if (!KEY) throw new Error('BREVO_API_KEY is not set');
  const api = (path, init = {}) => fetch(`https://api.brevo.com/v3${path}`, {
    ...init, headers: { 'api-key': KEY, Accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });

  const name = `dermi.ro – ${label}`;
  const existing = await (await api('/emailCampaigns?status=draft&limit=50')).json();
  if ((existing.campaigns ?? []).some(c => c.name === name)) {
    console.log(`A draft named "${name}" already exists — nothing to do.`);
    return;
  }

  const created = await api('/emailCampaigns', {
    method: 'POST',
    body: JSON.stringify({
      name, subject, previewText: `${fresh.length} articol${fresh.length === 1 ? '' : 'e'} nou${fresh.length === 1 ? '' : 'i'} pe dermi.ro`,
      sender: { id: SENDER_ID }, replyTo: 'contact@dermi.ro', htmlContent: html, recipients: { listIds: [LIST_ID] },
    }),
  });
  const out = await created.json().catch(() => ({}));
  if (!created.ok) throw new Error(`Brevo: HTTP ${created.status} ${out.code ?? ''} ${out.message ?? ''}`);
  console.log(`Draft created in Brevo: "${name}" (id ${out.id}) with ${fresh.length} article(s). Review and send it from Brevo → Campaigns.`);
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `created=true\nname=${name}\nid=${out.id}\ncount=${fresh.length}\n`, { flag: 'a' });
}

main().catch(err => { console.error(err.message ?? err); process.exitCode = 1; });
