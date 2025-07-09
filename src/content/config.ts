// src/content/config.ts

import { defineCollection, z } from 'astro:content';

const knowledgehubCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    lastModified: z.date().optional(),
  }),
});

export const collections = {
  knowledgehub: knowledgehubCollection,
};