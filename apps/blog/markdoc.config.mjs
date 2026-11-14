import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

// Posts are .mdoc so Keystatic's markdoc field round-trips them (tables are
// saved as {% table %}, which only Markdoc renders). Code fences go through expressive-code
// so they keep the same frames, themes and copy button as .md/.mdx did.
export default defineMarkdocConfig({
	tags: {
		// `{% takeaways %}...{% /takeaways %}`: the Key Takeaways box. A tag (not a
		// `>` blockquote) because Keystatic's serializer breaks lists in quotes.
		takeaways: {
			render: component('./src/components/Takeaways.astro'),
		},
	},
	nodes: {
		fence: {
			// Markdoc's default fence schema hides `content` and renames `language`,
			// so declare both explicitly to receive them as component props.
			attributes: {
				content: { type: String },
				language: { type: String },
			},
			render: component('./src/components/CodeFence.astro'),
		},
	},
});
