import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';

export const GET: APIRoute = async () => {
	const posts = (
		await getCollection('blog', ({ data }) => !data.draft)
	).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	const lines: string[] = [];
	lines.push(`# ${SITE_TITLE}`);
	lines.push('');
	lines.push(`> ${SITE_DESCRIPTION}`);
	lines.push('');
	lines.push(
		'Personal blog by Arnav Chauhan, software engineer. Long-form notes on web platforms, frontend performance, and developer tooling.',
	);
	lines.push('');
	lines.push('## Posts');
	lines.push('');
	for (const post of posts) {
		const url = `${SITE_URL}/${post.id}/`;
		const date = post.data.pubDate.toISOString().slice(0, 10);
		const tags = (post.data.tags ?? []).join(', ');
		const meta = [`published ${date}`, tags && `tags: ${tags}`]
			.filter(Boolean)
			.join('; ');
		lines.push(
			`- [${post.data.title}](${url}): ${post.data.description} (${meta})`,
		);
	}
	lines.push('');

	const tagSet = new Set<string>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) tagSet.add(tag);
	}
	if (tagSet.size > 0) {
		lines.push('## Topics');
		lines.push('');
		for (const tag of [...tagSet].sort()) {
			lines.push(`- [#${tag}](${SITE_URL}/tags/${tag}/)`);
		}
		lines.push('');
	}

	lines.push('## Optional');
	lines.push('');
	lines.push(`- [RSS feed](${SITE_URL}/rss.xml): Subscribe via RSS.`);
	lines.push(
		`- [Sitemap](${SITE_URL}/sitemap-index.xml): Full URL index.`,
	);
	lines.push(
		'- [About](https://blog.carnav.in/about/): About the author.',
	);
	lines.push(
		'- [Portfolio](https://www.carnav.in/): Author site with project history and links.',
	);

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
		},
	});
};
