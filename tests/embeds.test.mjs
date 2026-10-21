import test from 'node:test';
import assert from 'node:assert/strict';
import rehypeEmbed from '../src/plugins/rehype-embed.mjs';

function convert(href, label = href) {
  const tree = { type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children: [
    { type: 'element', tagName: 'a', properties: { href }, children: [{ type: 'text', value: label }] },
  ] }] };
  rehypeEmbed()(tree);
  return tree.children[0];
}

test('note article URL with tracking query becomes the official card and preserves source', () => {
  const href = 'https://note.com/creator/n/n012345abcdef?from=share';
  const card = convert(href);
  assert.equal(card.children[0].properties.src, 'https://note.com/embed/notes/n012345abcdef');
  assert.equal(card.children[1].properties.href, href);
});

test('all supported Hatena domains become encoded blog cards', () => {
  for (const domain of ['hatenablog.com', 'hatenablog.jp', 'hateblo.jp', 'hatenadiary.com', 'hatenadiary.jp']) {
    const href = `https://author.${domain}/entry/2026/10/21/日本語?x=1&y=2`;
    assert.equal(convert(href).children[0].properties.src, `https://hatenablog-parts.com/embed?url=${encodeURIComponent(href)}`);
  }
});

test('ordinary labeled links and unsupported pages remain ordinary links', () => {
  assert.equal(convert('https://note.com/creator/n/n012345abcdef', '記事を読む').tagName, 'p');
  assert.equal(convert('https://note.com/creator').tagName, 'p');
  assert.equal(convert('https://author.hatenablog.com/').tagName, 'p');
});

test('lookalike domains and non-web schemes cannot become embeds', () => {
  for (const href of ['https://note.com.evil.test/a/n/n012345abcdef', 'https://evilhatenablog.com/entry/a', 'javascript:alert(1)']) {
    assert.equal(convert(href).tagName, 'p');
  }
});

test('existing video and tweet conversion is preserved', () => {
  assert.equal(convert('https://youtu.be/jNQXAC9IVRw?t=1m30s').children[0].properties.src, 'https://www.youtube-nocookie.com/embed/jNQXAC9IVRw?start=90');
  assert.equal(convert('https://nico.ms/sm9').children[0].properties.src, 'https://embed.nicovideo.jp/watch/sm9');
  assert.equal(convert('https://x.com/jack/status/20').properties.className[1], 'embed-tweet');
});
