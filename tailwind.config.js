/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,ts}", "!./node_modules/**/*"],
  theme: {
    extend: {
      colors: {
        customGray: '#D9D8D8',
        customBlue: '#365266',
      },
      textShadow: {
        'custom': '2px 2px 5px rgba(0, 0, 0, 0.25)',  // Adjust values as necessary
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),  // Add plugin for text shadow
  ],
}
