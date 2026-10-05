import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // 省略するとサイト設定の投稿者になる
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // public/ 以下のパス(例: /images/sample.svg)。省略時はプレースホルダー表示
    thumbnail: z.string().optional(),
    // true にするとTOPページの「固定記事」に表示される
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
