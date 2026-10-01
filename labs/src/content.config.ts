import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One Markdown file per experiment. The file name is the slug; the
 * experiment itself lives at public/x/<slug>/index.html (any self-contained
 * HTML) unless `url` points somewhere else. The Markdown body is optional
 * notes shown under the experiment.
 */
const experiments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiments' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    date: z.coerce.date(),
    hue: z.enum(['violet', 'gold', 'sky', 'ember']).default('violet'),
    status: z.enum(['sketch', 'prototype', 'graduated']).default('sketch'),
    tags: z.array(z.string()).default([]),
    // Card image under public/, e.g. /x/<slug>/thumb.png. Optional.
    thumbnail: z.string().optional(),
    // Link out to an experiment hosted elsewhere instead of public/x/<slug>/.
    url: z.string().url().optional(),
    // 'strict' runs the experiment in an opaque origin (no cookies or
    // storage). Use 'same-origin' only for code you trust that needs
    // localStorage or similar.
    sandbox: z.enum(['strict', 'same-origin']).default('strict'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { experiments };
