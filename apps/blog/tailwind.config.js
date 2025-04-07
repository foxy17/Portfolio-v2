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
    },
  },
  plugins: [...sharedConfig.plugins],
};