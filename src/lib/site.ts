import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// True when a file referenced by an absolute site path exists in public/
export const publicFileExists = (path: string) =>
  !!path && existsSync(join(process.cwd(), 'public', path));

// Drafts are visible in `astro dev`, or in a build with PREVIEW_DRAFTS=1 (never set that in production)
export const showDrafts = import.meta.env.DEV || process.env.PREVIEW_DRAFTS === '1';

// Published posts, newest first
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const readingMinutes = (text = '') =>
  Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));

export const formatDate = (date: Date, lang: 'ro' | 'en' = 'ro') =>
  date.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

// Same category first, then shared tags; newest wins ties
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const score = (p: Post) =>
    (p.data.category === post.data.category ? 3 : 0) +
    p.data.tags.filter(t => post.data.tags.includes(t)).length;
  return all
    .filter(p => p.id !== post.id)
    .map(p => ({ p, s: score(p) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map(x => x.p);
}

export const ogImageFor = (slug: string) =>
  publicFileExists(`/assets/og/${slug}.png`) ? `/assets/og/${slug}.png` : '/assets/og-image.png';
