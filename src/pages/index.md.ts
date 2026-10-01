import { getPosts } from '../lib/site';
import { homeMarkdown } from '../lib/agents';

export async function GET() {
  return new Response(homeMarkdown(await getPosts()), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
