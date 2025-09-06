/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1200px"
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji']
      },
      colors: {
        brand: {
          DEFAULT: "#7C3AED",
          fg: "#E9D5FF",
          soft: "#A78BFA",
          ring: "#C4B5FD"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.12)"
      },
      backgroundImage: {
        "grid": "linear-gradient(to right,rgba(120,119,198,0.12) 1px,transparent 1px), linear-gradient(to bottom,rgba(120,119,198,0.12) 1px,transparent 1px)"
      },
      backgroundSize: {
        "grid": "24px 24px"
      }
    }
  },
  plugins: []
};
