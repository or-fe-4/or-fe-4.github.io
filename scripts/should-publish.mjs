import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublishable } from '../src/lib/publication.mjs';

export async function duePosts(root, now = Date.now()) {
  const found = [];
  async function walk(dir, prefix = '') {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) await walk(path.join(dir, entry.name), prefix + entry.name + '/');
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        const raw = await fs.readFile(path.join(dir, entry.name), 'utf8');
        const frontmatter = raw.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
        const publishAt = frontmatter.match(/^publishAt:\s*["']?([\dTtZz:+.\-]+)["']?\s*$/m)?.[1];
        const draft = /^draft:\s*true\s*(?:#.*)?$/m.test(frontmatter);
        if (publishAt && isPublishable({ draft, publishAt }, now)) found.push({ id: prefix + entry.name.slice(0,-3), publishAt });
      }
    }
  }
  await walk(root);
  return found;
}

export function needsPublication(due, manifest) {
  if (!due.length) return false;
  if (!manifest || !Array.isArray(manifest.posts) || !manifest.builtAt) return true;
  return due.some(post => !manifest.posts.includes(post.id) || Date.parse(manifest.builtAt) < Date.parse(post.publishAt));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const due = await duePosts('src/content/posts');
  let manifest = null;
  if (due.length) {
    try {
      const response = await fetch(`https://or-fe-4.github.io/publication.json?check=${Date.now()}`, { signal: AbortSignal.timeout(15000), cache:'no-store' });
      if (response.ok) manifest = await response.json();
    } catch { /* Retry publication when the last published state cannot be checked. */ }
  }
  console.log(`publish=${needsPublication(due, manifest)}`);
}
