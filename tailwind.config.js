/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary color palette adjusted to Tailor Swift rose accent
        primary: {
          50: "#fff5f5",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fda4a4",
          400: "#fb7185",
          500: "#F86A68",
          600: "#ea5754",
          700: "#c44340",
          800: "#9e302e",
          900: "#7a1f1d",
        },
        // Provide a compact brand token for components that want a single color
        brand: {
          DEFAULT: "#F86A68",
          600: "#ea5754",
        },
      },
    },
  },
  plugins: [],
};
