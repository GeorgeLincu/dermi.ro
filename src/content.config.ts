import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS } from './lib/categories';

// Articles: src/content/blog/<slug>.md — see docs/CONTENT-GUIDE.md. Set draft: false to publish.
// Keep this schema in sync with the server-side validation in worker/posts.ts.
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title:       z.string().min(10).max(110),
    description: z.string().min(50).max(170),
    pubDate:     z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category:    z.enum(CATEGORY_IDS),
    tags:        z.array(z.string()).default([]),
    draft:       z.boolean().default(false),
    // Optional hero image (public path, e.g. /media/blog/<slug>/cover.webp) and its alt text
    image:       z.string().optional(),
    imageAlt:    z.string().optional(),
    // Real questions people ask — rendered on the page and as FAQPage JSON-LD
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    sources: z.array(z.object({
      title:     z.string(),
      publisher: z.string().optional(),
      url:       z.url().optional(),
    })).default([]),
  }),
});

export const collections = { blog };
