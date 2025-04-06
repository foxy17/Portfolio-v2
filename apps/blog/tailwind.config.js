import sharedConfig from '@portfolio/tailwind-config';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
    },
  },
  plugins: [typographyPlugin],
}; 