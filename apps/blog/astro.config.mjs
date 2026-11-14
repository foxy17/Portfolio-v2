// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import markdoc from '@astrojs/markdoc';
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

// Sitemap inputs, read straight from post frontmatter (astro:content is not
// available in this file). Gives each post a lastmod and counts published
// posts per tag so thin tag pages (< 2 posts) stay out of the sitemap; the
// same threshold drives the noindex meta in src/pages/tags/[tag].astro.
// ponytail: assumes slug === filename, true for the glob loader as long as
// filenames are already lowercase slugs and no post sets a custom `slug`.
const postsDir = new URL('./src/content/blog/', import.meta.url);
const postLastmod = new Map();
const tagCounts = new Map();
for (const file of readdirSync(postsDir)) {
  const ext = file.match(/\.(md|mdx|mdoc)$/);
  if (!ext) continue;
  const raw = readFileSync(new URL(file, postsDir), 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = /** @type {any} */ ((fm && yaml.load(fm[1])) || {});
  if (data.draft) continue;
  const date = new Date(data.updatedDate ?? data.pubDate);
  if (!Number.isNaN(date.valueOf())) {
    postLastmod.set(file.slice(0, -ext[0].length), date.toISOString());
  }
  for (const tag of data.tags ?? []) {
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
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
    // Options live in ec.config.mjs so the <Code> component (used for
    // Markdoc fences) shares them.
    expressiveCode(),
    mdx(),
    markdoc({ allowHTML: true, typographer: true }),
    sitemap({
      filter: (page) => {
        if (page.includes('/keystatic') || page.includes('/api/')) return false;
        const tag = new URL(page).pathname.match(/^\/tags\/([^/]+)\/$/);
        return !tag || (tagCounts.get(decodeURIComponent(tag[1])) ?? 0) >= 2;
      },
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
          const lastmod = postLastmod.get(path.slice(1, -1));
          if (lastmod) item.lastmod = lastmod;
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
