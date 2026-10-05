import { visit } from 'unist-util-visit';

// 本文に「URLだけの行」を書くと、YouTube / ニコニコ動画 / X(Twitter) の埋め込みに変換する。
// [文字](URL) のように文字付きのリンクは、これまで通りただのリンクのまま。

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

/** "90" / "90s" / "1m30s" / "1h2m3s" -> 秒 */
function parseTime(v) {
  if (!v) return 0;
  if (/^\d+$/.test(v)) return Number(v);
  const m = v.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

function video(src, title) {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['embed', 'embed-video'] },
    children: [
      {
        type: 'element',
        tagName: 'iframe',
        properties: {
          src,
          title,
          loading: 'lazy',
          allowFullScreen: true,
          allow:
            'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
          referrerPolicy: 'strict-origin-when-cross-origin',
        },
        children: [],
      },
    ],
  };
}

function tweet(href) {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['embed', 'embed-tweet'] },
    children: [
      {
        type: 'element',
        tagName: 'blockquote',
        properties: { className: ['twitter-tweet'], dataDnt: 'true' },
        children: [
          {
            type: 'element',
            tagName: 'a',
            properties: { href },
            children: [{ type: 'text', value: href }],
          },
        ],
      },
    ],
  };
}

function parse(href) {
  let u;
  try {
    u = new URL(href);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(u.protocol)) return null;
  const host = u.hostname.replace(/^(www|m|mobile)\./, '');

  // YouTube
  let id = null;
  if (host === 'youtube.com') {
    id =
      u.pathname === '/watch'
        ? u.searchParams.get('v')
        : (u.pathname.match(/^\/(?:shorts|live|embed)\/([\w-]{11})/)?.[1] ?? null);
  } else if (host === 'youtu.be') {
    id = u.pathname.slice(1, 12);
  }
  if (id && /^[\w-]{11}$/.test(id)) {
    const start = parseTime(u.searchParams.get('t') ?? u.searchParams.get('start'));
    return video(
      `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}`,
      'YouTube動画',
    );
  }

  // ニコニコ動画 (nicovideo.jp/watch/sm9, nico.ms/sm9)
  const nico =
    host === 'nicovideo.jp'
      ? u.pathname.match(/^\/watch\/((?:sm|nm|so)?\d+)\/?$/)
      : host === 'nico.ms'
        ? u.pathname.match(/^\/((?:sm|nm|so)?\d+)\/?$/)
        : null;
  if (nico) return video(`https://embed.nicovideo.jp/watch/${nico[1]}`, 'ニコニコ動画');

  // X (Twitter)
  if (host === 'twitter.com' || host === 'x.com') {
    const m = u.pathname.match(/^\/(\w{1,15})\/status\/(\d+)/);
    if (m) return tweet(`https://twitter.com/${m[1]}/status/${m[2]}`);
  }

  return null;
}

export default function rehypeEmbed() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !(c.type === 'text' && c.value.trim() === ''));
      if (kids.length !== 1) return;
      const a = kids[0];
      if (a.type !== 'element' || a.tagName !== 'a') return;
      const href = a.properties?.href;
      if (typeof href !== 'string' || textOf(a).trim() !== href) return;
      const embed = parse(href);
      if (embed) parent.children[index] = embed;
    });
  };
}
