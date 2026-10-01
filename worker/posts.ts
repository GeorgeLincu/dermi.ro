// Article publishing from the vault: reads/writes src/content/blog/<slug>.md in the GitHub repo.
// Every save is a commit to main → Workers Builds rebuilds and deploys the site in ~1–2 minutes.
// Needs the secret GITHUB_TOKEN: a fine-grained token limited to this one repo, "Contents: Read and write".
//
// Keep validate() in sync with the content schema in src/content.config.ts.
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import type { Env } from './index';

const BLOG_DIR = 'src/content/blog';
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const CATEGORIES = ['afectiuni', 'estetica', 'ingrediente', 'protectie-solara', 'rutine', 'consultatii'] as const;

export interface Faq { q: string; a: string }
export interface Source { title: string; publisher?: string; url?: string }

export interface PostInput {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  pubDate: string;
  draft: boolean;
  image?: string;
  imageAlt?: string;
  faq: Faq[];
  sources: Source[];
  body: string;
  sha?: string; // required when updating an existing file (optimistic locking)
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  pubDate: string;
  updatedDate?: string;
  draft: boolean;
  todo: boolean; // still contains [TODO …] placeholders
}

// ─── GitHub REST helpers ─────────────────────────────────────────────
const repo = (env: Env) => env.GITHUB_REPO || 'GeorgeLincu/dermi.ro';
const branch = (env: Env) => env.GITHUB_BRANCH || 'main';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function gh(env: Env, path: string, init: RequestInit = {}) {
  if (!env.GITHUB_TOKEN) throw new HttpError(503, 'Publicarea nu este configurată (lipsește secretul GITHUB_TOKEN)');
  const res = await fetch(`https://api.github.com/repos/${repo(env)}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'dermi-vault',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (res.status === 404) return null;
  const data = await res.json().catch(() => ({})) as Record<string, unknown>;
  if (!res.ok) {
    const msg = typeof data.message === 'string' ? data.message : res.statusText;
    // 409/422 on PUT = file changed since it was opened (stale sha)
    throw new HttpError(res.status === 409 || res.status === 422 ? 409 : 502, `GitHub: ${msg}`);
  }
  return data;
}

const toBase64 = (bytes: Uint8Array) => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromBase64 = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), c => c.charCodeAt(0)));

// ─── Frontmatter ─────────────────────────────────────────────────────
const day = (v: unknown) => (v instanceof Date ? v.toISOString() : v == null ? '' : String(v)).slice(0, 10);
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export function parsePost(slug: string, text: string) {
  const m = text.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  let fm: Record<string, unknown> = {};
  if (m) { try { fm = (parseYaml(m[1]) ?? {}) as Record<string, unknown>; } catch { fm = {}; } }
  const body = (m ? m[2] : text).replace(/^\n+/, '');
  const list = <T>(v: unknown) => (Array.isArray(v) ? v : []) as T[];
  return {
    slug,
    title: str(fm.title),
    description: str(fm.description),
    category: str(fm.category),
    tags: list<unknown>(fm.tags).map(String),
    pubDate: day(fm.pubDate),
    updatedDate: day(fm.updatedDate) || undefined,
    draft: fm.draft === true,
    image: str(fm.image) || undefined,
    imageAlt: str(fm.imageAlt) || undefined,
    faq: list<Record<string, unknown>>(fm.faq).map(f => ({ q: str(f?.q), a: str(f?.a) })).filter(f => f.q && f.a),
    sources: list<Record<string, unknown>>(fm.sources).map(s => ({
      title: str(s?.title), ...(s?.publisher ? { publisher: str(s.publisher) } : {}), ...(s?.url ? { url: str(s.url) } : {}),
    })).filter(s => s.title),
    todo: /\[TODO/.test(text),
    body,
  };
}

function serialize(p: PostInput, updatedDate?: string) {
  const fm: Record<string, unknown> = {
    title: p.title,
    description: p.description,
    pubDate: p.pubDate,
    ...(updatedDate ? { updatedDate } : {}),
    category: p.category,
    tags: p.tags,
    draft: p.draft,
    ...(p.image ? { image: p.image } : {}),
    ...(p.imageAlt ? { imageAlt: p.imageAlt } : {}),
    ...(p.faq.length ? { faq: p.faq } : {}),
    ...(p.sources.length ? { sources: p.sources } : {}),
  };
  // Double-quoted strings, dates stay plain (YYYY-MM-DD), no line folding
  const yaml = stringifyYaml(fm, { defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN', lineWidth: 0 })
    .replace(/^(pubDate|updatedDate): "(\d{4}-\d{2}-\d{2})"$/gm, '$1: $2');
  return `---\n${yaml}---\n\n${p.body.replace(/\r\n/g, '\n').trim()}\n`;
}

// Claims that EU cosmetics rules (Reg. 1223/2009, Reg. 655/2013) don't allow for cosmetic products.
// The editor only WARNS — describing a medical treatment can legitimately use some of these words.
const CLAIMS: [RegExp, string][] = [
  [/\bvindec[ăa]\b|\bvindec[ăa]/i, '„vindecă”'],
  [/elimin[ăa] definitiv/i, '„elimină definitiv”'],
  [/dermatologic garantat|garantat dermatologic/i, '„dermatologic garantat”'],
  [/100\s*%\s*natural/i, '„100% natural”'],
  [/f[ăa]r[ăa] (nicio )?chimicale/i, '„fără chimicale”'],
  [/rezultate garantate|garantat[ăe]? rezultat/i, '„rezultate garantate”'],
  [/\bminune\b|miraculos/i, '„minune / miraculos”'],
  [/anti-?aging garantat|întinere[şș]te garantat/i, '„întinerire garantată”'],
];

export function claimWarnings(text: string): string[] {
  return CLAIMS.filter(([re]) => re.test(text)).map(([, label]) => label);
}

export function validate(raw: unknown): PostInput {
  const b = (raw ?? {}) as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);
  const post: PostInput = {
    slug: s(b.slug).toLowerCase(),
    title: s(b.title),
    description: s(b.description).replace(/\s+/g, ' '),
    category: s(b.category),
    tags: arr(b.tags).map(t => s(t).toLowerCase()).filter(Boolean).slice(0, 8),
    pubDate: s(b.pubDate),
    draft: b.draft !== false,
    image: s(b.image) || undefined,
    imageAlt: s(b.imageAlt) || undefined,
    faq: arr(b.faq).map(f => ({ q: s((f as Faq)?.q), a: s((f as Faq)?.a) })).filter(f => f.q || f.a).slice(0, 12),
    sources: arr(b.sources).map(x => {
      const o = x as Source;
      return { title: s(o?.title), ...(s(o?.publisher) ? { publisher: s(o.publisher) } : {}), ...(s(o?.url) ? { url: s(o.url) } : {}) };
    }).filter(x => x.title || x.url).slice(0, 20),
    body: typeof b.body === 'string' ? b.body : '',
    sha: s(b.sha) || undefined,
  };
  const errors: string[] = [];
  if (!SLUG_RE.test(post.slug) || post.slug.length > 90) errors.push('Adresa (URL): doar litere mici, cifre și cratime');
  if (post.title.length < 10 || post.title.length > 110) errors.push('Titlu: 10–110 caractere');
  if (post.description.length < 50 || post.description.length > 170) errors.push('Descriere: 50–170 caractere (apare în Google)');
  if (!(CATEGORIES as readonly string[]).includes(post.category)) errors.push('Alege o temă');
  if (post.tags.some(t => t.length > 40)) errors.push('Etichete: maximum 40 de caractere fiecare');
  if (!DATE_RE.test(post.pubDate) || isNaN(Date.parse(post.pubDate))) errors.push('Data: AAAA-LL-ZZ');
  if (post.image && !/^\/media\/blog\/[a-z0-9-]+\/[a-z0-9.-]+$/.test(post.image)) errors.push('Imaginea principală trebuie încărcată din editor');
  if (post.faq.some(f => !f.q || !f.a)) errors.push('Fiecare întrebare frecventă are nevoie de întrebare și răspuns');
  if (post.sources.some(x => !x.title)) errors.push('Fiecare sursă are nevoie de un titlu');
  if (post.sources.some(x => x.url && !/^https:\/\/[^\s]+$/.test(x.url))) errors.push('Linkurile surselor trebuie să înceapă cu https://');
  if (post.body.trim().length < 20) errors.push('Textul articolului este gol');
  if (post.body.length > 300_000) errors.push('Textul articolului este prea lung');
  if (/<script\b|<style\b|\sstyle\s*=|\son[a-z]+\s*=|javascript:/i.test(post.body)) errors.push('Fără <script>, <style>, style="" sau on…= în text (blocate de politica de securitate a site-ului)');
  const all = [post.title, post.description, post.body, ...post.faq.flatMap(f => [f.q, f.a])].join('\n');
  if (!post.draft && /\[TODO/.test(all)) errors.push('Articolul mai conține [TODO …]. Completează sau șterge aceste note înainte de publicare');
  if (errors.length) throw new HttpError(400, errors.join(' · '));
  return post;
}

// ─── Operations ─────────────────────────────────────────────────────
export async function listPosts(env: Env): Promise<PostMeta[]> {
  const items = (await gh(env, `/contents/${BLOG_DIR}?ref=${branch(env)}`)) as unknown as { name: string; type: string }[] | null;
  if (!items) return [];
  const files = items.filter(f => f.type === 'file' && f.name.endsWith('.md') && !f.name.startsWith('_'));
  const posts = await Promise.all(files.map(async f => {
    const got = await getPost(env, f.name.replace(/\.md$/, ''));
    if (!got) return null;
    const { slug, title, description, category, tags, pubDate, updatedDate, draft, todo } = got;
    return { slug, title, description, category, tags, pubDate, updatedDate, draft, todo };
  }));
  return (posts.filter(Boolean) as PostMeta[]).sort((a, b) => Number(a.draft) - Number(b.draft) || b.pubDate.localeCompare(a.pubDate));
}

export async function getPost(env: Env, slug: string) {
  if (!SLUG_RE.test(slug)) return null;
  const f = (await gh(env, `/contents/${BLOG_DIR}/${slug}.md?ref=${branch(env)}`)) as { content: string; sha: string } | null;
  if (!f) return null;
  return { ...parsePost(slug, fromBase64(f.content)), sha: f.sha };
}

export async function savePost(env: Env, post: PostInput, by: string) {
  const existing = await getPost(env, post.slug);
  if (existing && !post.sha) throw new HttpError(409, 'Există deja un articol cu această adresă. Deschide-l din listă ca să-l editezi');
  if (existing && post.sha && existing.sha !== post.sha) throw new HttpError(409, 'Articolul a fost modificat între timp. Reîncarcă-l înainte să salvezi');

  const today = new Date().toISOString().slice(0, 10);
  const firstPublish = !post.draft && (!existing || existing.draft);
  // A draft's planned date may lie in the future — publishing makes it "today" so Google never sees a future date
  if (firstPublish && post.pubDate > today) post.pubDate = today;
  // Articles migrated from the 2025 site (they carry an updatedDate) keep their original date and are
  // marked "updated today"; any other draft is published as of today, its real publication date.
  const migrated = !!existing?.draft && !!existing.updatedDate;
  if (firstPublish && !migrated && post.pubDate < today) post.pubDate = today;
  // "Updated" only for later edits of an already-published article, and never before the publish date
  let updatedDate = firstPublish ? (migrated ? today : undefined) : existing?.updatedDate;
  if (existing && !existing.draft && !post.draft && today > post.pubDate) updatedDate = today;
  if (updatedDate && updatedDate <= post.pubDate) updatedDate = undefined;
  const verb = existing ? (post.draft ? (existing.draft ? 'Update draft' : 'Unpublish') : existing.draft ? 'Publish' : 'Update') : (post.draft ? 'Add draft' : 'Publish');

  const res = (await gh(env, `/contents/${BLOG_DIR}/${post.slug}.md`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `${verb}: ${post.title}\n\nSaved from dermi.ro/vault by ${by}`,
      content: toBase64(new TextEncoder().encode(serialize(post, updatedDate))),
      branch: branch(env),
      ...(existing ? { sha: existing.sha } : {}),
    }),
  })) as { content?: { sha: string }; commit?: { sha: string; html_url: string } };
  return { sha: res?.content?.sha, commit: res?.commit?.html_url, commitSha: res?.commit?.sha, draft: post.draft, pubDate: post.pubDate };
}

export async function deletePost(env: Env, slug: string, sha: string, by: string) {
  const existing = await getPost(env, slug);
  if (!existing) throw new HttpError(404, 'Articolul nu există');
  if (existing.sha !== sha) throw new HttpError(409, 'Articolul a fost modificat între timp. Reîncarcă lista');
  await gh(env, `/contents/${BLOG_DIR}/${slug}.md`, {
    method: 'DELETE',
    body: JSON.stringify({ message: `Delete article: ${existing.title}\n\nDeleted from dermi.ro/vault by ${by}`, sha, branch: branch(env) }),
  });
}
