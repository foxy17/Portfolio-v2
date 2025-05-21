// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from "@astrojs/node";

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
  integrations: [mdx(), sitemap(), react()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: adapter,
});