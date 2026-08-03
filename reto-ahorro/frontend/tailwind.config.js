/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F2E2B',
        jade: {
          DEFAULT: '#1F7A5C',
          light: '#2FA37A',
          dark: '#14503C',
        },
        sage: '#F3F7F1',
        gold: {
          DEFAULT: '#D4A017',
          light: '#E8C158',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        wave: {
          '0%': { backgroundPositionX: '0px' },
          '100%': { backgroundPositionX: '56px' },
        },
      },
      animation: {
        wave: 'wave 2.4s linear infinite',
      },
    },
  },
  plugins: [],
}
