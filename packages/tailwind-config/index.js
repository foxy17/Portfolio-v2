/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    'ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'flat-yellow': '#fcba28',
        'flat-pink': '#f38ba3',
        'flat-green': '#0ba95b',
        beige: '#f9f4da',
        'beige-200': 'rgba(249,244,218,0.95)',
        'beige-500': 'rgba(249,244,218,0.9)',
        'flat-blue': '#12b5e5',
        'flat-orange': '#fc7428',
        'flat-red': '#ed203d',
        'flat-purple': '#7b5ea7',
        'dark-black': '#0F0D0E',
        'dark-grey': '#1D1A1B',
        blog: {
          border: '#B9A86A',
          'border-strong': '#817647',
          surface: '#FFF8DF',
          'code-inline-bg': '#EEE5BC',
          'code-inline-fg': '#8B3A12',
          'code-block-bg': '#201B1C',
          'code-block-border': '#4A3D41',
          'code-block-fg': '#F9F4DA',
          'dark-border': '#4A3D41',
          'dark-surface': '#171314',
          'dark-code-inline-bg': '#201B1C',
          'dark-code-inline-fg': '#FF9A5C',
        },
        gray: {
            0: '#fff',
            100: '#fafafa',
            200: '#eaeaea',
            300: '#999999',
            400: '#888888',
            500: '#666666',
            600: '#444444',
            700: '#333333',
            800: '#222222',
            900: '#111111',
          },
      },
      screens: {
        'showSocial': '1120px',
      },
      fontSize: {
        '6xl': ['3.5rem'],
      },
      dropShadow: {
        'card': '8px 8px rgba(255,255,255,1)',
        'card-dark': '8px 8px rgba(0, 0, 0,1)'
      },
      
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

if (typeof module !== 'undefined') {
  module.exports = config;
} 
