/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-orange-light": "#f8eaed",
        "custom-orange": "#ffb380",
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};
