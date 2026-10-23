// One-off (re-runnable) setup of Brevo content, using the shared e-mail layout:
//   - transactional template "DOI dermi.ro" (double opt-in confirmation; tag "optin" is required by Brevo)
//   - transactional template "Bun venit dermi.ro" (for the welcome automation)
//   - campaign DRAFT "Lansare dermi.ro" for list 3 (reviewed and sent manually)
//   BREVO_API_KEY=… node scripts/brevo-setup-content.mjs [--dry-run]
// Updates the existing template/draft with the same name instead of creating duplicates.
import { writeFileSync } from 'node:fs';
import { layout, p, h2, button, link, schedule } from './lib/email-layout.mjs';

const SITE = 'https://dermi.ro';
const LIST_ID = 3, SENDER_ID = 2;
const dryRun = process.argv.includes('--dry-run');

// Consulting schedule — keep in sync with src/data/locations.ts
const WEEK = [
  ['Luni', '14:00 – 19:00', 'Monetăriei 8'],
  ['Marți', '08:00 – 14:00', 'Monetăriei 8'],
  ['Miercuri', '12:00 – 18:00', 'Herăstrău 9'],
  ['Joi', '12:00 – 18:00', 'Monetăriei 8'],
  ['Vineri', '15:00 – 20:00', 'Herăstrău 9'],
];
const where = [
  h2('Unde consult'),
  p(`La Dr. Leventer Centre, în două locații din Sectorul 1, București: Strada Monetăriei nr. 8 și Strada Herăstrău nr. 9.`),
  schedule(WEEK),
  p(`Hărți, indicații și programul actualizat: ${link(`${SITE}/program/`, 'dermi.ro/program')}. Consultațiile se programează prin clinică.`),
].join('\n');

const doi = {
  name: 'DOI dermi.ro',
  subject: 'Confirmă abonarea la newsletterul dermi.ro',
  html: layout({
    title: 'Confirmă abonarea la newsletterul dermi.ro',
    preheader: 'Un singur clic și primești articolele noi de pe dermi.ro, cel mult o dată pe lună.',
    body: [
      p('Bună,'),
      p('Ai cerut să primești newsletterul dermi.ro: cel mult un e-mail pe lună, cu articolele noi despre sănătatea pielii, scrise de Dr. Mădălina Iulia Lincu, medic specialist dermatovenerolog.'),
      p('Apasă butonul de mai jos ca să confirmi abonarea.'),
      // Brevo replaces {{ doubleoptin }} with the confirmation link — keep it verbatim
      `<p style="margin:22px 0;"><a href="{{ doubleoptin }}" style="display:inline-block;background:#2d5a4d;color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:13px 26px;border-radius:999px;">Confirm abonarea</a></p>`,
      p('Dacă nu tu ai cerut abonarea, ignoră acest e-mail. Nu vei primi nimic de la noi.'),
      p(`Te poți dezabona oricând, din linkul aflat în fiecare newsletter. Detalii în ${link(`${SITE}/confidentialitate/#newsletter`, 'politica de confidențialitate')}.`),
    ].join('\n'),
  }),
};

const welcome = {
  name: 'Bun venit dermi.ro',
  subject: 'Bun venit la newsletterul dermi.ro',
  html: layout({
    title: 'Bun venit la newsletterul dermi.ro',
    marketing: true,
    preheader: 'Mulțumesc că te-ai abonat. Iată ce urmează.',
    body: [
      p('Bună,'),
      p('Mulțumesc că te-ai abonat la newsletterul dermi.ro! Sunt Dr. Mădălina Iulia Lincu, medic specialist dermatovenerolog, iar pe dermi.ro explic pe înțelesul tuturor ce se întâmplă cu pielea, părul și unghiile.'),
      h2('Ce vei primi'),
      p('Cel mult un e-mail pe lună, cu articolele noi: afecțiuni ale pielii, dermatologie estetică, ingrediente, protecție solară și rutine de îngrijire. Fără reclame și fără oferte.'),
      where,
      button(`${SITE}/blog/`, 'Citește articolele'),
      p('Cu drag,<br>Dr. Mădălina Iulia Lincu'),
    ].join('\n'),
  }),
};

const launch = {
  name: 'Lansare dermi.ro',
  subject: 'dermi.ro: dermatologie explicată de un medic',
  preview: 'Noul site al Dr. Mădălina Iulia Lincu: articole, program și locații.',
  html: layout({
    title: 'dermi.ro: dermatologie explicată de un medic',
    marketing: true,
    preheader: 'Noul site al Dr. Mădălina Iulia Lincu: articole, program și locații.',
    body: [
      p('Bună,'),
      p('Îți scriu pentru că te-ai abonat la newsletterul dermi.ro, site-ul în care explic, pe înțelesul tuturor, sănătatea pielii, a părului și a unghiilor.'),
      h2('Ce găsești pe dermi.ro'),
      p('Ghiduri clare, bazate pe ghidurile medicale actuale și cu sursele la vedere: acnee, rozacee, dermatită atopică, alunițe și semne de alarmă, protecție solară, ingrediente precum retinolul sau niacinamida, precum și proceduri de dermatologie estetică explicate onest: ce pot face, ce nu și ce riscuri au.'),
      button(`${SITE}/blog/`, 'Vezi articolele'),
      where,
      h2('Despre mine'),
      p(`Sunt absolventă a UMF „Carol Davila” din București, am făcut rezidențiatul în dermatovenerologie la Spitalul Clinic Universitar de Urgență „Elias” și am stagii de formare la Gent și Bruxelles. Mai multe pe ${link(`${SITE}/despre/`, 'pagina Despre')}.`),
      p('Newsletterul vine cel mult o dată pe lună. Nu răspund la întrebări medicale prin e-mail: pentru o problemă a pielii, programează o consultație.'),
      p('Cu drag,<br>Dr. Mădălina Iulia Lincu'),
    ].join('\n'),
  }),
};

if (dryRun) {
  writeFileSync('brevo-doi.html', doi.html);
  writeFileSync('brevo-welcome.html', welcome.html);
  writeFileSync('brevo-launch.html', launch.html);
  console.log('[dry run] wrote brevo-doi.html, brevo-welcome.html and brevo-launch.html');
} else {
  const KEY = process.env.BREVO_API_KEY;
  if (!KEY) throw new Error('BREVO_API_KEY is not set');
  const api = async (path, init = {}) => {
    const r = await fetch(`https://api.brevo.com/v3${path}`, { ...init, headers: { 'api-key': KEY, Accept: 'application/json', 'Content-Type': 'application/json' } });
    const text = await r.text();
    if (!r.ok) throw new Error(`${init.method ?? 'GET'} ${path}: HTTP ${r.status} ${text}`);
    return text ? JSON.parse(text) : {};
  };

  const tpls = (await api('/smtp/templates?limit=100')).templates ?? [];

  // Double opt-in template — must stay active and tagged "optin"
  const doiBody = { templateName: doi.name, subject: doi.subject, sender: { id: SENDER_ID }, replyTo: 'contact@dermi.ro', htmlContent: doi.html, isActive: true, tag: 'optin' };
  const doiTpl = tpls.find(t => t.name === doi.name);
  if (doiTpl) { await api(`/smtp/templates/${doiTpl.id}`, { method: 'PUT', body: JSON.stringify(doiBody) }); console.log(`template updated: "${doi.name}" (id ${doiTpl.id})`); }
  else { const r = await api('/smtp/templates', { method: 'POST', body: JSON.stringify(doiBody) }); console.log(`template created: "${doi.name}" (id ${r.id}) — set BREVO_DOI_TEMPLATE_ID to it`); }

  // Welcome template (transactional template; its HTML is also pasted into the Brevo welcome automation)
  const tplBody = { templateName: welcome.name, subject: welcome.subject, sender: { id: SENDER_ID }, replyTo: 'contact@dermi.ro', htmlContent: welcome.html, isActive: true };
  const tpl = tpls.find(t => t.name === welcome.name);
  if (tpl) { await api(`/smtp/templates/${tpl.id}`, { method: 'PUT', body: JSON.stringify(tplBody) }); console.log(`template updated: "${welcome.name}" (id ${tpl.id})`); }
  else { const r = await api('/smtp/templates', { method: 'POST', body: JSON.stringify(tplBody) }); console.log(`template created: "${welcome.name}" (id ${r.id})`); }

  // Launch campaign draft
  const drafts = (await api('/emailCampaigns?status=draft&limit=50')).campaigns ?? [];
  const cBody = { name: launch.name, subject: launch.subject, previewText: launch.preview, sender: { id: SENDER_ID }, replyTo: 'contact@dermi.ro', htmlContent: launch.html, recipients: { listIds: [LIST_ID] } };
  const draft = drafts.find(c => c.name === launch.name);
  if (draft) { await api(`/emailCampaigns/${draft.id}`, { method: 'PUT', body: JSON.stringify(cBody) }); console.log(`campaign draft updated: "${launch.name}" (id ${draft.id})`); }
  else { const r = await api('/emailCampaigns', { method: 'POST', body: JSON.stringify(cBody) }); console.log(`campaign draft created: "${launch.name}" (id ${r.id}) — not sent`); }
}
