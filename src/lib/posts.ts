import { getCollection, type CollectionEntry } from 'astro:content';
import { listEmoji } from '../plugins/rehype-emoji.mjs';

export type Post = CollectionEntry<'posts'>;

/** 公開用の記事一覧(下書きは本番ビルドから除外)。新しい順。 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Markdownを検索・抜粋用の平文にする(簡易)。 */
export function toPlainText(md: string): string {
  const emoji = listEmoji();
  return md
    // 絵文字記法 :名前: は抜粋・検索から除く
    .replace(/:([^\s:]+):/g, (m, name) => (emoji.has(name) ? '' : m))
    .replace(/<details[^>]*>|<\/details>|<summary[^>]*>|<\/summary>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^https?:\/\/\S+$/gm, ' ') // 埋め込み用のURLだけの行
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\[\^[^\]]+\]:.*$/gm, ' ')
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~`|]/g, '')
    .replace(/^[-+]\s+/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(md: string, length = 90): string {
  const text = toPlainText(md);
  return text.length > length ? text.slice(0, length) + '…' : text;
}

/** タグ → 件数 */
export function countTags(posts: Post[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return map;
}
