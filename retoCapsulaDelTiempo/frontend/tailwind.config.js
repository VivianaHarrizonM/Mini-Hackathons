/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
      },
      colors: {
        ink: '#3a1024',
        capsule: {
          bg: '#786543',    // ciruela suave (antes navy) — navbar, sellos, bloques oscuros
          gold: '#000',  // rosa palo (antes dorado) — acentos, botones destacados
          cream: '#fdf3f6', // rosa-crema muy claro (antes crema) — fondo general
        }
      }
    },
  },
  plugins: [],
}
