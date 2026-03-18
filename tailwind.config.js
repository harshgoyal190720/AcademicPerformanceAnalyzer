/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9eeff",
          200: "#bce0ff",
          300: "#8bc8ff",
          400: "#52a8ff",
          500: "#2b86ff",
          600: "#1c69f1",
          700: "#1a53d9",
          800: "#1d45af",
          900: "#1d3d8a",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(28, 105, 241, 0.12)",
      },
      keyframes: {
        pulseCard: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        pulseCard: "pulseCard 2.2s ease-in-out infinite",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
