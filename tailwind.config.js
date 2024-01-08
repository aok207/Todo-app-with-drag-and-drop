/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"],
      },
      colors: {
        "bright-blue": "#3a7bfd",
        "gradient-1": "#57ddff",
        "gradient-2": "#c058f3",
        "very-light-gray": "#fafafa",
        "very-light-grayish-blue": "#e4e5f1",
        "light-grayish-blue-light": "#d2d3db",
        "dark-grayish-blue-light": "#9394a5",
        "very-dark-grayish-blue-light": "#484b6a",
        "very-dark-blue": "#161722",
        "very-desaturated-blue": "#25273c",
        "light-grayish-blue-dark": "#cacde8",
        "light-grayish-blue-hover": "#e4e5f1",
        "dark-grayish-blue-dark": "#777a92",
        "very-dark-grayish-blue-dark": "#4d5066",
        "very-dark-grayish-blue-dark-2": "#393a4c",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
