// Read-only per-post view count from a self-hosted Umami instance. Recording and
// visitor dedupe live in Umami's tracking script (BaseHead.astro); this only reads.

// First defined value across import.meta.env (PUBLIC_*, inlined at build) and
// process.env (secrets, resolved at runtime on Vercel).
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

const HOST = readEnv('PUBLIC_UMAMI_HOST')?.replace(/\/+$/, '');
const WEBSITE_ID = readEnv('PUBLIC_UMAMI_WEBSITE_ID');
const API_USER = readEnv('UMAMI_API_USER');
const API_PASSWORD = readEnv('UMAMI_API_PASSWORD');

const METRICS_TTL = 60_000;
const TOKEN_TTL = 30 * 60_000;

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

// Pageview counts per path for the whole site in one cached call.
async function getMetrics(): Promise<Map<string, number> | null> {
	if (!HOST || !WEBSITE_ID) return null;
	const now = Date.now();
	if (metricsCache && now - metricsCache.at < METRICS_TTL) return metricsCache.map;

	const token = await getToken();
	if (!token) return null;
	try {
		const url = new URL(`${HOST}/api/websites/${WEBSITE_ID}/metrics`);
		url.searchParams.set('type', 'path');
		url.searchParams.set('startAt', '0');
		url.searchParams.set('endAt', String(now));
		const res = await fetch(url, {
			headers: { authorization: `Bearer ${token}` },
		});
		if (!res.ok) return null;
		const rows = (await res.json()) as { x: string; y: number }[];
		const map = new Map<string, number>();
		for (const row of rows) {
			// Strip query/hash/trailing-slash so /slug, /slug/ and /slug/#anchor merge.
			const key = row.x.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
			map.set(key, (map.get(key) ?? 0) + (Number(row.y) || 0));
		}
		metricsCache = { map, at: now };
		return map;
	} catch {
		return null;
	}
}

export async function getViews(slug: string): Promise<number | null> {
	const map = await getMetrics();
	if (!map) return null;
	const key = `/${slug}`.replace(/\/+$/, '') || '/';
	return map.get(key) ?? 0;
}
