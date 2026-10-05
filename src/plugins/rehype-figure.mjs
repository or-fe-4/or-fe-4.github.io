import { visit } from 'unist-util-visit';

// ![代替テキスト](/images/a.svg "ここが画像の脚注になる")
// タイトル付きの画像だけを <figure><img><figcaption> に変換する。
export default function rehypeFigure() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const meaningful = node.children.filter(
        (c) => !(c.type === 'text' && c.value.trim() === ''),
      );
      if (meaningful.length !== 1) return;
      const img = meaningful[0];
      if (img.type !== 'element' || img.tagName !== 'img') return;
      const caption = img.properties?.title;
      if (typeof caption !== 'string' || caption === '') return;

      delete img.properties.title;
      img.properties.loading = 'lazy';
      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          img,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: caption }],
          },
        ],
      };
    });
  };
}
