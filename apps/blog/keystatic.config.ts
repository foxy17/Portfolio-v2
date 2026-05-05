import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
	storage: { kind: 'local' },
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
