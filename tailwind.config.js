/** @type {import('tailwindcss').Config} */
const {spacing, fontFamily} = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'flat-yellow': '#fcba28',
                'flat-pink': '#f38ba3',
                'flat-green': '#0ba95b',
                'beige': '#f9f4da',
                'beige.200': 'rgba(249,244,218,0.95)',
                'beige.500': 'rgba(249,244,218,0.9)',
                'flat-blue': '#12b5e5',
                'flat-orange': '#fc7428',
                'flat-red': '#ed203d',
                'flat-purple': '#7b5ea7',
                'dark-black': '#0F0D0E',
                'dark-grey': '#1D1A1B',
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
            fontFamily: {
                paytone: ['Paytone One', 'sans-serif'],
                outift: ['Outfit', 'sans-serif'],
            },
        },
    },
    variants: {
        typography: ['dark'],
    },
    plugins: [require('@tailwindcss/typography'), require('@tailwindcss/line-clamp'),],
};
