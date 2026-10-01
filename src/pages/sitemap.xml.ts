import type { APIContext } from 'astro';
import { CATEGORY_IDS } from '../lib/categories';
import { getPosts, isoDay } from '../lib/site';
import { PAGE_PAIRS } from '../i18n/ui';

type Entry = { loc: string; lastmod?: string; alt?: { ro: string; en: string } };

// Hand-rolled so the URL stays /sitemap.xml and RO/EN pairs carry hreflang links. Drafts are never listed.
export async function GET({ site }: APIContext) {
  const abs   = (p: string) => new URL(p, site).href;
  const posts = (await getPosts()).filter(p => !p.data.draft);
  const today = isoDay(new Date());
  const newest = posts[0] ? isoDay(posts[0].data.updatedDate ?? posts[0].data.pubDate) : today;

  const entries: Entry[] = [
    ...Object.entries(PAGE_PAIRS).flatMap(([ro, en]) => {
      const lastmod = ro === '/' ? newest : today;
      return [{ loc: ro, lastmod, alt: { ro, en } }, { loc: en, lastmod, alt: { ro, en } }];
    }),
    { loc: '/blog/', lastmod: newest },
    ...CATEGORY_IDS.filter(id => posts.some(p => p.data.category === id)).map(id => ({ loc: `/blog/categorie/${id}/`, lastmod: newest })),
    ...posts.map(p => ({ loc: `/blog/${p.id}/`, lastmod: isoDay(p.data.updatedDate ?? p.data.pubDate) })),
  ];

  const url = (e: Entry) => {
    const lines = [`    <loc>${abs(e.loc)}</loc>`];
    if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    if (e.alt) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="ro" href="${abs(e.alt.ro)}"/>`);
      lines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${abs(e.alt.en)}"/>`);
      lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(e.alt.ro)}"/>`);
    }
    return `  <url>\n${lines.join('\n')}\n  </url>`;
  };

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map(url),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
