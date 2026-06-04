import { config, fields, collection, singleton } from '@keystatic/core';

// Storage resolution (must match on server + client, so read it from
// import.meta.env which Astro exposes to both):
// - production build -> GitHub (the deployed /keystatic commits to the repo)
// - local dev        -> local filesystem (edits write straight to ./src/content)
// - PUBLIC_KEYSTATIC_STORAGE=github -> force GitHub mode anywhere, including
//   localhost. Needed once to run the "Connect to GitHub" app-creation wizard,
//   which Keystatic only renders on localhost — a deployed domain just shows a
//   "Log in with GitHub" button that dead-ends until the KEYSTATIC_* env exist.
const storageKind =
	import.meta.env.PUBLIC_KEYSTATIC_STORAGE ??
	(import.meta.env.DEV ? 'local' : 'github');
const storage =
	storageKind === 'github'
		? ({ kind: 'github', repo: 'foxy17/Portfolio-v2' } as const)
		: ({ kind: 'local' } as const);

// In a monorepo, GitHub storage reads paths relative to the repo root, while
// local storage reads them relative to cwd (apps/blog). Prefix every
// repo-relative path with the app dir in GitHub mode so the dashboard finds
// content; leave it empty locally. publicPath URLs are unaffected.
const repoDir = storageKind === 'github' ? 'apps/blog/' : '';

export default config({
	storage,
	ui: {
		brand: { name: 'Arnav Chauhan' },
	},
	collections: {
		posts: collection({
			label: 'Blog posts',
			slugField: 'title',
			path: `${repoDir}src/content/blog/*`,
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
					// Stored in src/assets so Astro's image() optimizes it. The
					// publicPath is relative to the post .md (src/content/blog/*),
					// matching existing `../../assets/blog/...` hero values so they
					// render in the editor. Relative path is repo-layout agnostic,
					// so no repoDir prefix here.
					directory: `${repoDir}src/assets/blog`,
					publicPath: '../../assets/blog/',
				}),
				ogImage: fields.image({
					label: 'OG image override',
					description:
						'Optional. Custom social card image (1200×630). Falls back to hero image.',
					directory: `${repoDir}public/og`,
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
				// Author is always the site owner. Omitted from the dashboard so
				// there's no field to set; content.config.ts defaults every post's
				// `author` to 'Arnav Chauhan' at read time.
				draft: fields.checkbox({
					label: 'Draft',
					description: 'Drafts are excluded from production builds.',
					defaultValue: false,
				}),
				content: fields.markdoc({
					label: 'Content',
					extension: 'md',
					options: {
						// Body images share the hero store: src/assets/blog with a
						// post-relative publicPath, so existing `![](../../assets/blog/..)`
						// images show in the editor and new uploads stay Astro-optimized.
						image: {
							directory: `${repoDir}src/assets/blog`,
							publicPath: '../../assets/blog/',
						},
					},
				}),
			},
		}),
	},
	singletons: {
		site: singleton({
			label: 'Site settings',
			path: `${repoDir}src/content/site/`,
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
