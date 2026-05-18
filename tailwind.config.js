/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f6',
          100: '#e5eee9',
          200: '#cbdad1',
          300: '#a7c1b4',
          400: '#81a393',
          500: '#628775',
          600: '#4d6b5d',
          700: '#3e564b',
          800: '#33463e',
          900: '#2a3a33',
        },
        crimson: {
          50: '#fdf2f4',
          100: '#fce6ea',
          200: '#fad1d8',
          300: '#f6b0be',
          400: '#ef849a',
          500: '#e45472',
          600: '#d13253',
          700: '#ae2340',
          800: '#902138',
          900: '#7a1f33',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
