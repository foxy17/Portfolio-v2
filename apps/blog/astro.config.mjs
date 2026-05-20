// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from "@astrojs/node";
import keystatic from '@keystatic/astro';
import expressiveCode from 'astro-expressive-code';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// Lightweight reading-time remark plugin (no external dep).
// Surfaces `minutesRead` on frontmatter, available via render().remarkPluginFrontmatter.
function remarkReadingTime() {
  return function (tree, { data }) {
    let words = 0;
    const visit = (node) => {
      if (node.type === 'text' && typeof node.value === 'string') {
        words += node.value.split(/\s+/).filter(Boolean).length;
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
    const minutes = Math.max(1, Math.round(words / 200));
    data.astro.frontmatter.minutesRead = `${minutes} min read`;
    data.astro.frontmatter.wordCount = words;
  };
}

let adapter =  vercel({
  webAnalytics: {
    enabled: true,
  },
});
    
if (process.argv[3] === "--node" || process.argv[4] === "--node") {
  adapter = node({ mode: "standalone" });
}
   

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.carnav.in',
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) =>
        theme.type === 'dark' ? '.dark' : ':root:not(.dark)',
      defaultProps: {
        wrap: true,
      },
      frames: {
        showCopyToClipboardButton: true,
      },
      styleOverrides: {
        borderRadius: '0.5rem',
        borderWidth: '1px',
        codeFontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        codeFontSize: '0.9rem',
        codeLineHeight: '1.65',
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/keystatic') && !page.includes('/api/'),
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname;
        if (path === '/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (/^\/[^/]+\/$/.test(path)) {
          // Top-level slug: blog post
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.5;
        }
        return item;
      },
    }),
    react(),
    keystatic(),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: adapter,
});
