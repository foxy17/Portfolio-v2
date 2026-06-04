import type { APIRoute } from 'astro';
import { recordView, dailyHash, isBot } from '../../lib/views';

// On-demand function (not pre-rendered) so it runs per request on Vercel.
export const prerender = false;

function json(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'no-store',
		},
	});
}

export const POST: APIRoute = async ({ request, url }) => {
	const slug = url.searchParams.get('slug');
	if (!slug) return json({ error: 'missing slug' }, 400);

	const ua = request.headers.get('user-agent') ?? '';
	if (isBot(ua)) return json({ views: null, skipped: 'bot' });

	const country = request.headers.get('x-vercel-ip-country') ?? '';
	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'';

	const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const hash = await dailyHash([slug, ip, ua, day]);
	const views = await recordView(slug, country, hash);
	return json({ views });
};
