/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },

      colors: {
        ink: '#26352A',

        cream: '#FFF8EC',
        paper: '#F7EFE2',

        forest: {
          DEFAULT: '#304B3A',
          dark: '#203429',
          light: '#DCE5D7',
        },
    
        terra: {
          DEFAULT: '#D65A38',
          dark: '#B8442B',
          light: '#F3C5B5',
        },
        mustard: {
          DEFAULT: '#E9AD3D',
          light: '#F8E0A5',
        },
        clay: {
          DEFAULT: '#E7B7A5',
          light: '#F4DDD4',
        },

        sage: {
          DEFAULT: '#A9B59A',
          light: '#E4E9DE',
        },

        stone: {
          DEFAULT: '#D8CDBB',
          light: '#EEE7DA',
        },
      },
    },
  },

  plugins: [],
}