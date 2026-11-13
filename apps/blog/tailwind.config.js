import sharedConfig from '@portfolio/tailwind-config';


module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    'ui/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
      typography: ({ theme }) => ({
        DEFAULT: {
          css: 
            {
              // Main text color in light mode
              color: theme('colors.gray.700'), // #333333 for beige background
              maxWidth: '65ch',

              // Links
              a: {
                color: theme('colors.flat-blue'), // #12b5e5
                textDecoration: 'underline',
                fontWeight: '500',
                '&:hover': {
                  color: theme('colors.flat-blue'),
                },
              },

              // Bold text
              strong: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              'a strong': { color: 'inherit' },
              'blockquote strong': { color: 'inherit' },
              'thead th strong': { color: 'inherit' },

              // Lists
              ol: { listStyleType: 'decimal' },
              'ol[type="A"]': { listStyleType: 'upper-alpha' },
              'ol[type="a"]': { listStyleType: 'lower-alpha' },
              'ol[type="A" s]': { listStyleType: 'upper-alpha' },
              'ol[type="a" s]': { listStyleType: 'lower-alpha' },
              'ol[type="I"]': { listStyleType: 'upper-roman' },
              'ol[type="i"]': { listStyleType: 'lower-roman' },
              'ol[type="I" s]': { listStyleType: 'upper-roman' },
              'ol[type="i" s]': { listStyleType: 'lower-roman' },
              'ol[type="1"]': { listStyleType: 'decimal' },
              ul: { listStyleType: 'disc' },
              'ol > li::marker': {
                fontWeight: '400',
                color: theme('colors.gray.500'), // #666666
              },
              'ul > li::marker': {
                color: theme('colors.gray.500'), // #666666
              },

              // Headings
              h1: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '800',
                fontSize: '3rem',
              },
              'h1 strong': { fontWeight: '900', color: 'inherit' },
              h2: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '700',
              },
              'h2 strong': { fontWeight: '800', color: 'inherit' },
              h3: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              'h3 strong': { fontWeight: '700', color: 'inherit' },
              h4: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              'h4 strong': { fontWeight: '700', color: 'inherit' },

              // Blockquotes
              blockquote: {
                fontWeight: '500',
                fontStyle: 'italic',
                color: theme('colors.gray.700'), // readable on beige
                borderInlineStartWidth: '0.25rem',
                borderInlineStartColor: theme('colors.flat-green'), // #0ba95b
                quotes: '"\\201C""\\201D""\\2018""\\2019"',
              },
              'blockquote p': { color: 'inherit' },
              'blockquote p:first-of-type::before': { content: 'open-quote', color: theme('colors.flat-green') },
              'blockquote p:last-of-type::after': { content: 'close-quote' , color: theme('colors.flat-green')},

              // Code
              code: {
                color: theme('colors.blog.code-inline-fg'),
                fontWeight: '600',
                backgroundColor: theme('colors.blog.code-inline-bg'),
                borderRadius: '0.125rem',
              },
              'code::before': { content: '"\u00A0"' },
              'code::after': { content: '"\u00A0"' },
              'a code': { color: 'inherit' },
              'h1 code': { color: 'inherit' },
              'h2 code': { color: 'inherit' },
              'h3 code': { color: 'inherit' },
              'h4 code': { color: 'inherit' },
              'blockquote code': { color: 'inherit' },
              'thead th code': { color: 'inherit' },
              pre: {
                color: theme('colors.blog.code-block-fg'),
                backgroundColor: theme('colors.blog.code-block-bg'),
                border: `1px solid ${theme('colors.blog.code-block-border')}`,
                overflowX: 'auto',
                fontWeight: '400',
              },
              'pre code': {
                backgroundColor: 'transparent',
                borderWidth: '0',
                borderRadius: '0',
                padding: '0',
                fontWeight: 'inherit',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                lineHeight: 'inherit',
              },
              'pre code::before': { content: 'none' },
              'pre code::after': { content: 'none' },

              

              // Horizontal rules
              hr: {
                borderColor: theme('colors.blog.border'),
                borderTopWidth: '1px',
              },

              // Tables
              table: {
                width: '100%',
                tableLayout: 'auto',
                marginTop: '2rem',
                marginBottom: '2rem',
              },
              thead: {
                borderBottomWidth: '1px',
                borderBottomColor: theme('colors.blog.border'),
              },
              'thead th': {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
                verticalAlign: 'bottom',
              },
              'tbody tr': {
                borderBottomWidth: '1px',
                borderBottomColor: theme('colors.blog.code-inline-bg'),
              },
              'tbody tr:last-child': { borderBottomWidth: '0' },
              'tbody td': { verticalAlign: 'baseline' },
              tfoot: {
                borderTopWidth: '1px',
                borderTopColor: theme('colors.blog.border'),
              },
              'tfoot td': { verticalAlign: 'top' },
              'th, td': { textAlign: 'start' },

              // Other elements
              dt: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              figcaption: {
                color: theme('colors.gray.600'), // #444444
              },
            },
          
        },
        invert: {
          css: 
            {
              // Main text color in dark mode
              color: theme('colors.beige'), // #f9f4da

              // Links
              a: {
                color: theme('colors.flat-blue'), // #12b5e5
                '&:hover': {
                  color: theme('colors.flat-blue'),
                },
              },

              // Bold text
              strong: {
                color: theme('colors.gray.0'), // #fff
              },

              // Lists
              'ol > li::marker': {
                color: theme('colors.beige.200'), // rgba(249,244,218,0.95)
              },
              'ul > li::marker': {
                color: theme('colors.beige.200'), // rgba(249,244,218,0.95)
              },


              // Headings
              h1: { color: theme('colors.beige') }, // #fff
              h2: { color: theme('colors.beige') }, // #fff
              h3: { color: theme('colors.beige') }, // #fff
              h4: { color: theme('colors.beige') }, // #fff

              // Blockquotes
              blockquote: {
                color: '#D7CEB2',
                backgroundColor: 'rgba(249, 244, 218, 0.035)',
                borderInlineStartColor: theme('colors.flat-green'), // #0ba95b
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                paddingInlineEnd: '1rem',
              },
              'blockquote p': { color: 'inherit' },
              'blockquote p:first-of-type::before': { color: theme('colors.flat-green') },
              'blockquote p:last-of-type::after': { color: theme('colors.flat-green') },

              // Code
              code: {
                color: theme('colors.blog.dark-code-inline-fg'),
                fontWeight: '600',
                backgroundColor: theme('colors.blog.dark-code-inline-bg'),
                borderRadius: '0.125rem',
              },
              pre: {
                color: theme('colors.blog.code-block-fg'),
                backgroundColor: theme('colors.blog.code-block-bg'),
                border: `1px solid ${theme('colors.blog.code-block-border')}`,
              },
              'pre code': {
                backgroundColor: 'transparent',
                color: 'inherit',
              },
              'pre code': {
                backgroundColor: 'transparent',
                borderWidth: '0',
                borderRadius: '0',
                padding: '0',
                fontWeight: 'inherit',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                lineHeight: 'inherit',
              },
              'pre code::before': { content: 'none' },
              'pre code::after': { content: 'none' },

              // Horizontal rules
              hr: {
                borderColor: theme('colors.blog.dark-border'),
              },

              // Tables
              thead: {
                borderBottomColor: theme('colors.blog.dark-border'),
              },
              'thead th': {
                color: theme('colors.gray.0'), // #fff
              },
              'tbody tr': {
                borderBottomColor: theme('colors.blog.dark-border'),
              },
              tfoot: {
                borderTopColor: theme('colors.blog.dark-border'),
              },

              // Other elements
              dt: {
                color: theme('colors.gray.0'), // #fff
              },
              figcaption: {
                color: theme('colors.beige.200'), // rgba(249,244,218,0.95)
              },
            },
          
        },
      }),
    },
  },
  plugins: [...sharedConfig.plugins],
};
