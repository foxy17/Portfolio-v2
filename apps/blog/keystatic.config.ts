import { config, fields, collection, singleton } from '@keystatic/core';

// Local filesystem in dev (edits write straight to ./src/content), GitHub in
// production so the deployed /keystatic dashboard commits drafts + posts to the
// repo. GitHub mode needs the KEYSTATIC_* env vars (see apps/blog/.env.example);
// connect the GitHub App once via the deployed dashboard to generate them.
const storage = import.meta.env.DEV
	? ({ kind: 'local' } as const)
	: ({ kind: 'github', repo: 'foxy17/Portfolio-v2' } as const);

export default config({
	storage,
	ui: {
		brand: { name: 'Arnav Chauhan' },
	},
	collections: {
		posts: collection({
			label: 'Blog posts',
			slugField: 'title',
			path: 'src/content/blog/*',
			format: { contentField: 'content' },
			entryLayout: 'content',
			columns: ['title', 'pubDate'],
			schema: {
				title: fields.slug({
					name: { label: 'Title', validation: { length: { min: 1, max: 120 } } },
					slug: {
						label: 'Slug',
						description: 'URL slug for this post (used as the filename and route).',
					},
				}),
				description: fields.text({
					label: 'Description',
					description: 'Short summary used for SEO and social cards.',
					multiline: true,
					validation: { length: { min: 1, max: 200 } },
				}),
				pubDate: fields.date({
					label: 'Publish date',
					validation: { isRequired: true },
				}),
				updatedDate: fields.date({ label: 'Updated date' }),
				heroImage: fields.image({
					label: 'Hero image',
					directory: 'public/heroes',
					publicPath: '/heroes/',
				}),
				ogImage: fields.image({
					label: 'OG image override',
					description:
						'Optional. Custom social card image (1200×630). Falls back to hero image.',
					directory: 'public/og',
					publicPath: '/og/',
				}),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tags',
					itemLabel: (props) => props.value,
				}),
				category: fields.select({
					label: 'Category',
					options: [
						{ label: '—', value: '' },
						{ label: 'Engineering', value: 'engineering' },
						{ label: 'Notes', value: 'notes' },
						{ label: 'Essays', value: 'essays' },
						{ label: 'Links', value: 'links' },
					],
					defaultValue: '',
				}),
				author: fields.text({
					label: 'Author',
					defaultValue: 'Arnav Chauhan',
				}),
				draft: fields.checkbox({
					label: 'Draft',
					description: 'Drafts are excluded from production builds.',
					defaultValue: false,
				}),
				content: fields.markdoc({
					label: 'Content',
					extension: 'md',
					options: {
						image: {
							directory: 'public/heroes',
							publicPath: '/heroes/',
						},
					},
				}),
			},
		}),
	},
	singletons: {
		site: singleton({
			label: 'Site settings',
			path: 'src/content/site/',
			schema: {
				title: fields.text({ label: 'Site title' }),
				description: fields.text({
					label: 'Site description',
					multiline: true,
				}),
			},
		}),
	},
});
