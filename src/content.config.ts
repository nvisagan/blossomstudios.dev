import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string().max(160),
    platforms: z.array(z.string()),
    installUrl: z.string().url(),
    githubUrl: z.string().url().optional(),
    version: z.string().optional(),
    pricing: z.enum(['free', 'freemium', 'paid']).default('free'),
    features: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    order: z.number().default(0),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Blossom Studios'),
    tags: z.array(z.string()).default([]),
    product: z.string().optional(),
    type: z.enum(['changelog', 'tutorial', 'article']).default('article'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products, blog };
