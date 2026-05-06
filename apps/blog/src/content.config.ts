import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string().max(120),
		description: z.string().max(200),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).default([]),
		author: z.string().default('Arnav Chauhan'),
		draft: z.boolean().default(false),
		category: z
			.preprocess(
				(v) => (v === '' ? undefined : v),
				z.enum(['engineering', 'notes', 'essays', 'links']).optional(),
			),
		ogImage: z.string().optional(),
	}),
});

export const collections = { blog };
