import type { APIRoute } from 'astro';
import { getPosts, toPlainText } from '../lib/posts';

// サイト内検索用の全文インデックス(ビルド時に生成される静的JSON)
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const index = posts.map((p) => ({
    slug: p.id,
    text: [p.data.title, p.data.tags.join(' '), p.data.author ?? '', toPlainText(p.body ?? '')]
      .join(' ')
      .toLowerCase(),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
