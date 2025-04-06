const sharedConfig = require('@portfolio/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
      // Next.js specific theme extensions
      fontFamily: {
        paytone: ['var(--font-paytone)', 'sans-serif'],
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      keyframes: {
        horizontalBounce: {
          '0%, 100%': {
            transform: 'translateX(0%)',
            transitionTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateX(-25%)',
            transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        wave: {
          to: {
            'margin-left': '-51%',
          },
        },
      },
      animation: {
        rectilinear: 'horizontalBounce 1s infinite',
        wave: 'wave 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [...sharedConfig.plugins],
};
