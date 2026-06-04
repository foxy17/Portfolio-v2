import { Redis } from '@upstash/redis';

let client: Redis | null = null;
let resolved = false;

/**
 * Lazily build the Upstash client. Returns null when env vars are absent
 * (local dev, previews without secrets) so callers degrade to a no-op
 * instead of throwing.
 */
function getClient(): Redis | null {
	if (resolved) return client;
	resolved = true;
	const url =
		import.meta.env.UPSTASH_REDIS_REST_URL ??
		process.env.UPSTASH_REDIS_REST_URL;
	const token =
		import.meta.env.UPSTASH_REDIS_REST_TOKEN ??
		process.env.UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) return null;
	client = new Redis({ url, token });
	return client;
}

// One round trip per view: SET-NX dedupe gate, and only on a fresh key do we
// INCR the total + HINCRBY the country bucket. Returns the current total.
const RECORD_VIEW = `
local isNew = redis.call('SET', KEYS[1], '1', 'NX', 'EX', tonumber(ARGV[2]))
if isNew then
  redis.call('INCR', KEYS[2])
  if ARGV[1] ~= '' then
    redis.call('HINCRBY', KEYS[3], ARGV[1], 1)
  end
end
local total = redis.call('GET', KEYS[2])
if total then return tonumber(total) else return 0 end
`;

const DAY_TTL = '86400';

/**
 * Record a view for `slug`, gated by `dedupeHash` (unique per visitor/day).
 * `country` is the ISO code from `x-vercel-ip-country` ('' to skip geo).
 * Returns the new total, or null when Redis is unconfigured / errors.
 */
export async function recordView(
	slug: string,
	country: string,
	dedupeHash: string,
): Promise<number | null> {
	const redis = getClient();
	if (!redis) return null;
	try {
		const total = await redis.eval(
			RECORD_VIEW,
			[`seen:${slug}:${dedupeHash}`, `views:${slug}`, `views:${slug}:cc`],
			[country || '', DAY_TTL],
		);
		return Number(total) || 0;
	} catch {
		return null;
	}
}

/** Read the current total for `slug`. Null when unconfigured / errors. */
export async function getViews(slug: string): Promise<number | null> {
	const redis = getClient();
	if (!redis) return null;
	try {
		const total = await redis.get<number>(`views:${slug}`);
		return Number(total ?? 0) || 0;
	} catch {
		return null;
	}
}

/** One-way daily fingerprint. No raw IP/UA persisted; gate key carries a 24h TTL. */
export async function dailyHash(parts: string[]): Promise<string> {
	const data = new TextEncoder().encode(parts.join('|'));
	const digest = await crypto.subtle.digest('SHA-256', data);
	return [...new Uint8Array(digest)]
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

const BOT_RE =
	/bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|bingpreview|discordbot|whatsapp|telegrambot|preview|headless|phantom|curl|wget|python-requests|axios|node-fetch|go-http|ahrefs|semrush|dataforseo|petalbot|lighthouse|pingdom|uptimerobot/i;

export function isBot(ua: string): boolean {
	return !ua || BOT_RE.test(ua);
}
