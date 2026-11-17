// Editorial lint for articles (drafts included): frontmatter, length, internal links, phrases to avoid.
//   npm run check:articles [-- slug1 slug2 …]
// Errors (exit 1) are things the build would reject or that break the site; warnings are editorial.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const dir = join(root, 'src/content/blog');
const CATEGORIES = ['afectiuni', 'estetica', 'ingrediente', 'protectie-solara', 'rutine', 'consultatii'];
const slugs = new Set(readdirSync(dir).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, '')));
const only = process.argv.slice(2);

// Formulaic phrases that make a text read as machine-written, plus claims we never make
const AVOID = [
  /vestea bună/i, /este important de (menționat|reținut|știut)/i, /joac[ăa] un rol (crucial|esențial|important)/i,
  /în concluzie/i, /în era (modernă|digitală)/i, /în zilele noastre/i, /nu în ultimul rând/i, /merită menționat/i,
  /o adevărată/i, /secretul/i, /tratament(ul)?[- ]minune/i, /scap[ăi] definitiv/i, /rezultate garantate/i,
  /călători[ae]/i, /\bdescoper[ăi] cum\b/i, /haideți să/i, /să (ne )?scufundăm/i,
];
const TU = /(?<!\p{L})(poți|faci|mergi|știi|vrei|ești|folosești|aplici|alegi|întreabă-ți|adresează-te)(?!\p{L})/u;

let errors = 0, warnings = 0;
const err = (s, m) => { errors++; console.log(`✗ ${s}: ${m}`); };
const warn = (s, m) => { warnings++; console.log(`! ${s}: ${m}`); };

for (const slug of [...slugs].sort()) {
  if (only.length && !only.includes(slug)) continue;
  if (slug === 'testingarticle') continue;
  const text = readFileSync(join(dir, `${slug}.md`), 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) { err(slug, 'no frontmatter'); continue; }
  let fm;
  try { fm = parse(m[1]); } catch (e) { err(slug, `YAML: ${e.message.split('\n')[0]}`); continue; }
  const body = m[2];
  if (!fm.title || fm.title.length < 10 || fm.title.length > 110) err(slug, `title length ${fm.title?.length}`);
  if (!fm.description || fm.description.length < 50 || fm.description.length > 170) err(slug, `description length ${fm.description?.length}`);
  if (!CATEGORIES.includes(fm.category)) err(slug, `category "${fm.category}"`);
  if (fm.draft !== true) err(slug, 'draft must be true');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fm.pubDate instanceof Date ? fm.pubDate.toISOString().slice(0, 10) : fm.pubDate))) err(slug, 'pubDate');
  for (const f of fm.faq ?? []) if (!f.q || !f.a) err(slug, 'faq item without q/a');
  for (const s of fm.sources ?? []) {
    if (!s.title) err(slug, 'source without title');
    if (s.url && !/^https:\/\/\S+$/.test(s.url)) err(slug, `source url ${s.url}`);
  }
  if (/\[TODO/.test(`${fm.title}\n${fm.description}`)) err(slug, '[TODO in title/description');
  if (/<script\b|<style\b|\sstyle\s*=|\son[a-z]+\s*=/i.test(body)) err(slug, 'inline script/style in body');
  for (const [, href] of body.matchAll(/\]\((\/blog\/[^)#\s]*)\)/g)) {
    const target = href.replace(/^\/blog\//, '').replace(/\/$/, '');
    if (!slugs.has(target)) err(slug, `internal link to missing article ${href}`);
  }
  const prose = body.replace(/^## \[TODO[\s\S]*$/m, '');
  const words = prose.split(/\s+/).filter(Boolean).length;
  if (words < 1300 || words > 2100) warn(slug, `${words} words (target 1,500–1,800)`);
  if (!/\]\(\/program\/\)/.test(body)) warn(slug, 'no CTA link to /program/');
  if (!/^## \[TODO: Notă pentru medic/m.test(body)) warn(slug, 'no "## [TODO: Notă pentru medic" section');
  if ((fm.sources ?? []).length < 3) warn(slug, `${(fm.sources ?? []).length} sources`);
  const all = [fm.title, fm.description, prose, ...(fm.faq ?? []).flatMap(f => [f.q, f.a])].join('\n');
  for (const re of AVOID) if (re.test(all)) warn(slug, `avoid phrase ${re}`);
  const tu = all.replace(/\]\([^)]*\)/g, ']').match(TU);
  if (tu) warn(slug, `"tu" form? "${tu[0]}" (articles use "dumneavoastră")`);
  const dashes = (prose.match(/ — /g) ?? []).length;
  if (dashes > 12) warn(slug, `${dashes} em dashes (machine-like rhythm)`);
}
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
