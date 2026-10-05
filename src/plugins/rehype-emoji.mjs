import { readdirSync } from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

const EXT = /\.(png|gif|webp|jpe?g|svg)$/i;

/** public/emoji/ にある画像の一覧。ファイル名(拡張子なし) -> 公開パス */
export function listEmoji(dir = path.resolve('public/emoji')) {
  const map = new Map();
  try {
    for (const file of readdirSync(dir)) {
      if (EXT.test(file)) map.set(file.replace(EXT, ''), `/emoji/${file}`);
    }
  } catch {
    /* フォルダがなければ絵文字なし */
  }
  return map;
}

// 本文中の :名前: を、public/emoji/名前.* の画像(一文字サイズ)に置き換える。
// 画像が存在する名前だけが対象なので、「12:30:45」のような文字列は変換されない。
export default function rehypeEmoji() {
  return (tree) => {
    const emoji = listEmoji(); // 毎回読むので、開発中に画像を足しても再起動不要
    if (emoji.size === 0) return;

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (parent.type === 'element' && (parent.tagName === 'code' || parent.tagName === 'pre')) return;

      const re = /:([^\s:]+):/g;
      const out = [];
      let last = 0;
      let m;
      while ((m = re.exec(node.value)) !== null) {
        const src = emoji.get(m[1]);
        if (!src) {
          re.lastIndex = m.index + 1; // 閉じ側の「:」から探し直す
          continue;
        }
        if (m.index > last) out.push({ type: 'text', value: node.value.slice(last, m.index) });
        out.push({
          type: 'element',
          tagName: 'img',
          properties: { className: ['emoji'], src, alt: m[0], title: m[0], draggable: 'false' },
          children: [],
        });
        last = m.index + m[0].length;
      }
      if (out.length === 0) return;
      if (last < node.value.length) out.push({ type: 'text', value: node.value.slice(last) });

      parent.children.splice(index, 1, ...out);
      return index + out.length;
    });
  };
}
