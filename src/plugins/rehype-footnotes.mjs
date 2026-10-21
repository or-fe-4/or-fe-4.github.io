import { visit } from 'unist-util-visit';

export default function rehypeFootnotes() {
  return tree => {
    visit(tree, 'element', node => {
      if (node.tagName === 'h2' && node.properties?.id === 'footnote-label') {
        node.children = [{ type: 'text', value: '脚注' }];
      }
      if (node.tagName !== 'a' || !Object.hasOwn(node.properties ?? {}, 'dataFootnoteBackref')) return;
      const repeats = node.children.filter(child => child.type === 'element' && child.tagName === 'sup');
      node.properties.ariaLabel = '本文の参照位置に戻る';
      node.children = [{
        type: 'element', tagName: 'svg',
        properties: { viewBox: '0 0 16 16', ariaHidden: 'true', focusable: 'false' },
        children: [{ type: 'element', tagName: 'path', properties: { d: 'M6 3 2 7l4 4M2 7h8a3 3 0 0 1 0 6H8' }, children: [] }],
      }, ...repeats];
    });
  };
}
