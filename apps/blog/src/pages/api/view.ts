import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
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

// Slug must match a real post before it can mint Redis keys. Cached per
// function instance so it's one collection read, not one per request.
let knownSlugs: Set<string> | null = null;
async function isKnownSlug(slug: string): Promise<boolean> {
	if (!knownSlugs) {
		const posts = await getCollection('blog');
		knownSlugs = new Set(posts.map((p) => p.id));
	}
	return knownSlugs.has(slug);
}

export const POST: APIRoute = async ({ request, url }) => {
	const slug = url.searchParams.get('slug');
	if (!slug) return json({ error: 'missing slug' }, 400);
	// Cheap shape gate before the set lookup; rejects oversized/malformed keys.
	if (slug.length > 200 || !/^[\w/-]+$/.test(slug)) {
		return json({ error: 'invalid slug' }, 400);
	}
	if (!(await isKnownSlug(slug))) return json({ error: 'unknown slug' }, 404);

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
