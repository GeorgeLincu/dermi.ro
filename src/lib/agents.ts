// Plain-text / Markdown views of the site for AI agents and LLM crawlers (llms.txt convention).
// Generated from the same sources as the HTML pages, so they never drift.
import { CONFIG } from '../config';
import { CATEGORIES, type CategoryId } from './categories';
import { isoDay, type Post } from './site';
import { EDUCATION, MEMBERSHIPS, AREAS } from '../data/profile';

const site = CONFIG.site;
const doc  = CONFIG.doctor;

export const postUrl   = (p: Post) => `${site}/blog/${p.id}/`;
export const postMdUrl = (p: Post) => `${site}/blog/${p.id}.md`;

const DISCLAIMER = 'Medical disclaimer: informational content only, not medical advice. Readers should consult a dermatologist for diagnosis and treatment.';

const about = () => [
  `${doc.name} — ${doc.title.ro} (${doc.title.en})${doc.practice.city ? `, ${doc.practice.city}` : ''}, Romania.`,
  ...(doc.practice.name ? [`Practice: ${doc.practice.name}${doc.practice.url ? ` (${doc.practice.url})` : ''}.`] : []),
  ...(doc.cmrCode ? [`Colegiul Medicilor din România code: ${doc.cmrCode}.`] : []),
  `Education: ${EDUCATION.university.en} (${EDUCATION.university.year}); ${EDUCATION.residency.en}.`,
  `Member of: ${MEMBERSHIPS.map(m => `${m.en} (${m.short})`).join(', ')}.`,
  `Training and interests: ${AREAS.join(', ')}.`,
];

const contact = [
  `- E-mail: ${CONFIG.email} (no medical advice by e-mail)`,
  ...(CONFIG.bookingUrl ? [`- Book a consultation: ${CONFIG.bookingUrl}`] : []),
  `- About the doctor: ${site}/despre/`,
];

/** Markdown version of the homepage (/index.md) */
export function homeMarkdown(posts: Post[]) {
  return [
    `# ${CONFIG.brand} — dermatologie explicată de un medic specialist`,
    '',
    `> dermi.ro publishes evidence-based articles in Romanian about skin, hair and nail health and aesthetic dermatology, written by ${doc.name}, ${doc.title.en}.`,
    '',
    ...about(),
    '',
    '## Topics',
    '',
    ...(Object.keys(CATEGORIES) as CategoryId[]).map(id =>
      `- [${CATEGORIES[id].ro.name}](${site}/blog/categorie/${id}/): ${CATEGORIES[id].en.desc}`),
    '',
    '## Latest articles',
    '',
    ...(posts.length
      ? posts.slice(0, 20).map(p => `- [${p.data.title}](${postMdUrl(p)}): ${p.data.description}`)
      : ['- No articles published yet.']),
    '',
    '## Contact',
    '',
    ...contact,
    '',
    DISCLAIMER,
    '',
  ].join('\n');
}

/** /llms.txt — the index an agent reads first (https://llmstxt.org) */
export function llmsTxt(posts: Post[]) {
  const byCat = (id: CategoryId) => posts.filter(p => p.data.category === id);
  return [
    `# ${CONFIG.brand} (dermi.ro)`,
    '',
    `> Romanian-language medical information site about dermatology and aesthetic dermatology by ${doc.name}, ${doc.title.en} (${doc.title.ro}). Articles are evidence-based, cite their sources and show publication and update dates.`,
    '',
    ...about(),
    'The name Dermi combines "derm" (Greek dérma, skin) and "MI", the doctor’s initials (Mădălina Iulia).',
    `Content may be quoted and summarised with attribution to "${doc.name}, dermi.ro" and a link to the article. ${DISCLAIMER}`,
    '',
    '## About',
    '',
    `- [Site overview (Markdown)](${site}/index.md)`,
    `- [About the doctor](${site}/despre/) · [English](${site}/en/about/)`,
    '',
    ...(Object.keys(CATEGORIES) as CategoryId[]).flatMap(id => {
      const list = byCat(id);
      if (!list.length) return [];
      return [`## ${CATEGORIES[id].ro.name} (${CATEGORIES[id].en.name})`, '',
        ...list.map(p => `- [${p.data.title}](${postMdUrl(p)}): ${p.data.description} (${isoDay(p.data.updatedDate ?? p.data.pubDate)})`), ''];
    }),
    ...(posts.length ? [] : ['## Articles', '', '- No articles published yet.', '']),
    '## Contact',
    '',
    ...contact,
    '',
    '## Optional',
    '',
    `- [Everything on one page](${site}/llms-full.txt): overview plus the full text of every article`,
    `- [RSS feed](${site}/rss.xml)`,
    `- [Sitemap](${site}/sitemap.xml)`,
    `- [Legal notice](${site}/legal/) and [privacy policy](${site}/confidentialitate/)`,
    '',
  ].join('\n');
}

/** Markdown version of one article (/blog/<slug>.md) */
export function postMarkdown(p: Post) {
  const d = p.data;
  return [
    `# ${d.title}`,
    '',
    `> ${d.description}`,
    '',
    `Author: ${doc.name}, ${doc.title.ro} · Published: ${isoDay(d.pubDate)}${d.updatedDate ? ` · Updated: ${isoDay(d.updatedDate)}` : ''} · Topic: ${CATEGORIES[d.category].ro.name} · Tags: ${d.tags.join(', ')}`,
    `Canonical: ${postUrl(p)}`,
    '',
    (p.body ?? '').trim(),
    '',
    ...(d.faq.length ? ['## Întrebări frecvente', '', ...d.faq.flatMap(f => [`### ${f.q}`, '', f.a, ''])] : []),
    ...(d.sources.length ? ['## Surse', '', ...d.sources.map(s =>
      `- ${s.url ? `[${s.title}](${s.url})` : s.title}${s.publisher ? ` — ${s.publisher}` : ''}`), ''] : []),
    DISCLAIMER,
    '',
  ].join('\n');
}

/** /llms-full.txt — overview + all articles in one file */
export function llmsFullTxt(posts: Post[]) {
  return [homeMarkdown(posts), ...posts.map(p => `\n---\n\n${postMarkdown(p)}`)].join('\n');
}
