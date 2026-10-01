import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { CONFIG } from '../config';
import { getPosts } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Dermi — articole de dermatologie',
    description: `Articole despre sănătatea pielii de ${CONFIG.doctor.name}, ${CONFIG.doctor.title.ro.toLowerCase()}.`,
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      author: `${CONFIG.email} (${CONFIG.doctor.name})`,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>ro-ro</language>',
  });
}
