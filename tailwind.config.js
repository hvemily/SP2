/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,ts}", "!./node_modules/**/*"],
  theme: {
    screens: {
      sm: "640px",
      md: "970px", 
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        customGray: "#D9D8D8",
        customBlue: "#365266",
      },
      textShadow: {
        custom: "2px 2px 5px rgba(0, 0, 0, 0.25)", 
      },
    },
  },
  plugins: [
    require("tailwindcss-textshadow"),
  ],
};
