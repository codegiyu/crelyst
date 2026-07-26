import { buildLlmsDocument } from '@/lib/seo/llms';

export const dynamic = 'force-dynamic';

export async function GET() {
  const body = await buildLlmsDocument(true);

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
