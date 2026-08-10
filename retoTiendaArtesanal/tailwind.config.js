/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        ink: '#2b2620',
        lino: '#f0ead9',
        indigo: {
          DEFAULT: '#33465c',
          dark: '#232f3d',
        },
        barro: '#a8503a',
        musgo: '#707d54',
        kraft: {
          DEFAULT: '#d9c7a3',
          light: '#e8dcc0',
        },
      },
    },
  },
  plugins: [],
}