import { defineCollection, z } from 'astro:content';

const knowledgehub = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(), // <-- ต้องเป็น Date จริง ๆ
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  knowledgehub,
};