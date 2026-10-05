// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeFigure from './src/plugins/rehype-figure.mjs';
import rehypeEmoji from './src/plugins/rehype-emoji.mjs';
import rehypeEmbed from './src/plugins/rehype-embed.mjs';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages(ユーザーサイト: リポジトリ名が <ユーザー名>.github.io)の場合、base は不要。
  // 独自ドメインを使うときは、この site をそのドメインに変えて public/CNAME を置く。
  site: 'https://or-fe-4.github.io',
  trailingSlash: 'always',
  markdown: {
    // 脚注 [^1]・表・取り消し線(GFM)を使うため、unifiedプロセッサを明示する。
    // rehypeFigure: ![alt](src "脚注") を <figure><figcaption> に変換(自作)
    // rehypeEmbed : URLだけの行を YouTube / ニコニコ / X の埋め込みに変換(自作)
    // rehypeEmoji : :名前: を public/emoji/ の画像に変換(自作)。順番はこのまま。
    processor: unified({
      gfm: true,
      rehypePlugins: [rehypeFigure, rehypeEmbed, rehypeEmoji],
    }),
    // 白黒統一のためコードブロックは装飾なし
    syntaxHighlight: false,
  },
});
