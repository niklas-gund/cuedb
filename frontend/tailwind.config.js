/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}" /* src folder, for example */],
  theme: {
    extend: {
      // Sizes ---------------------
      spacing: {
        128: "32rem",
      },
      // Colors --------------------
      colors: {
        navy: {
          50: "#f1f4ff",
          100: "#e5e8ff",
          200: "#ced5ff",
          300: "#a7b1ff",
          400: "#767fff",
          500: "#3f42ff",
          600: "#2118ff",
          700: "#1007fa",
          800: "#0d05d2",
          900: "#0c06ac",
          950: "#000068",
          DEFAULT: "#000068",
        },
        amber: "#FFBE0B",
      },
    },
  },
  plugins: [],
};
