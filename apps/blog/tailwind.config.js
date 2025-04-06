import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import sharedConfig from '@portfolio/tailwind-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the path to ui package's main file
const uiPackageMainPath = require.resolve('ui');
const uiSrcDir = join(dirname(uiPackageMainPath), 'src');

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    uiSrcDir + '/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
    },
  },
  plugins: [...sharedConfig.plugins],
};