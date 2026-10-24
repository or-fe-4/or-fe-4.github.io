import { getPosts } from '../lib/posts';

export async function GET() {
  const posts = await getPosts();
  return new Response(JSON.stringify({
    builtAt: new Date().toISOString(),
    revision: import.meta.env.GITHUB_SHA ?? null,
    posts: posts.map(post => post.id),
  }), { headers: { 'Content-Type': 'application/json' } });
}
