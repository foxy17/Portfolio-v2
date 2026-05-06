// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from "@astrojs/node";
import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

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
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: adapter,
});