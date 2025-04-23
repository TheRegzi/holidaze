import textShadow from "tailwindcss-textshadow";

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
      fontFamily: {
        rancho: ["Rancho", "cursive"],
        nunito: ["Nunito", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      width: {
        xs: "300px",
        sm: "450px",
        md: "600px",
        lg: "800px",
        xl: "1000px",
        "2xl": "1200px",
      },
    },
  },
  plugins: [textShadow],
};
