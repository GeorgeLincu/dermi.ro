// dermi.ro Worker — serves the static site (Astro build in ./dist) and the few dynamic endpoints.
//
//   POST /api/contact   contact form → e-mail to the doctor via Cloudflare Email Routing
//   anything else       static assets (the Worker only runs for the paths in "run_worker_first")
import { handleContact, type ContactEnv } from './contact';

export interface Env extends ContactEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
