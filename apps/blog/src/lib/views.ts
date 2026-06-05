// Per-post view count, read from a self-hosted Umami instance.
//
// Umami's own tracking script (loaded in BaseHead.astro) records pageviews and
// dedupes visitors itself — a daily-rotating hash of IP + user-agent, no
// cookies. This module only READS: it asks Umami for the pageview count of each
// post's path and returns it for the inline "👁 N views" counter.
//
// Returns null whenever the Umami env is absent (local dev, previews without
// secrets) or the API errors, so callers hide the counter instead of throwing.

// Read the first defined value across import.meta.env (build/SSR) and
// process.env (runtime) for any of the given names. PUBLIC_* are inlined at
// build; secrets resolve from process.env at runtime on Vercel.
function readEnv(...names: string[]): string | undefined {
	const sources: Record<string, string | undefined>[] = [
		(import.meta.env ?? {}) as unknown as Record<string, string | undefined>,
		typeof process !== 'undefined'
			? (process.env as Record<string, string | undefined>)
			: {},
	];
	for (const name of names) {
		for (const source of sources) {
			const value = source?.[name];
			if (value) return value;
		}
	}
	return undefined;
}

// Public: also embedded in the client tracking script tag, so not secret.
const HOST = readEnv('PUBLIC_UMAMI_HOST')?.replace(/\/+$/, '');
const WEBSITE_ID = readEnv('PUBLIC_UMAMI_WEBSITE_ID');
// Server-only: a (read-only) Umami account used to mint an API token.
const API_USER = readEnv('UMAMI_API_USER');
const API_PASSWORD = readEnv('UMAMI_API_PASSWORD');

const METRICS_TTL = 60_000; // serve one /metrics call to all posts for a minute
const TOKEN_TTL = 30 * 60_000; // re-login well before Umami's token expiry

let tokenCache: { token: string; at: number } | null = null;
let metricsCache: { map: Map<string, number>; at: number } | null = null;

async function getToken(): Promise<string | null> {
	if (!HOST || !API_USER || !API_PASSWORD) return null;
	const now = Date.now();
	if (tokenCache && now - tokenCache.at < TOKEN_TTL) return tokenCache.token;
	try {
		const res = await fetch(`${HOST}/api/auth/login`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username: API_USER, password: API_PASSWORD }),
		});
		if (!res.ok) return null;
		const data = (await res.json()) as { token?: string };
		if (!data.token) return null;
		tokenCache = { token: data.token, at: now };
		return data.token;
	} catch {
		return null;
	}
}

// Fetch pageview counts per URL path for the whole site in one call, cached.
async function getMetrics(): Promise<Map<string, number> | null> {
	if (!HOST || !WEBSITE_ID) return null;
	const now = Date.now();
	if (metricsCache && now - metricsCache.at < METRICS_TTL) return metricsCache.map;

	const token = await getToken();
	if (!token) return null;
	try {
		const url = new URL(`${HOST}/api/websites/${WEBSITE_ID}/metrics`);
		url.searchParams.set('type', 'url');
		url.searchParams.set('startAt', '0');
		url.searchParams.set('endAt', String(now));
		const res = await fetch(url, {
			headers: { authorization: `Bearer ${token}` },
		});
		if (!res.ok) return null;
		const rows = (await res.json()) as { x: string; y: number }[];
		const map = new Map<string, number>();
		for (const row of rows) {
			// Collapse trailing slashes so /slug and /slug/ count together.
			const key = row.x.replace(/\/+$/, '') || '/';
			map.set(key, (map.get(key) ?? 0) + (Number(row.y) || 0));
		}
		metricsCache = { map, at: now };
		return map;
	} catch {
		return null;
	}
}

/** Read the pageview count for `slug`. Null when Umami is unconfigured / errors. */
export async function getViews(slug: string): Promise<number | null> {
	const map = await getMetrics();
	if (!map) return null;
	const key = `/${slug}`.replace(/\/+$/, '') || '/';
	return map.get(key) ?? 0;
}
