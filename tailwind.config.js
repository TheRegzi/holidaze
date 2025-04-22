/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFF3E0",
        secondary: "#FFF8EC",
        accent: "#FF9800",
        accentLight: "#FFCC80",
        accentDark: "#E65100",
        red: "#D23D0F",
        green: "#31A706",
        darkGrey: "#585858",
        lightGray: "#8E8E8E",
      },
    },
  },
  plugins: [],
};
