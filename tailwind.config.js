/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--color-bg) / <alpha-value>)",
        black: "rgb(var(--color-text) / <alpha-value>)",
        ...['zinc', 'gray', 'neutral', 'slate', 'stone'].reduce((acc, colorGroup) => {
          acc[colorGroup] = {
            50: "rgb(var(--color-zinc-50) / <alpha-value>)",
            100: "rgb(var(--color-zinc-100) / <alpha-value>)",
            200: "rgb(var(--color-zinc-200) / <alpha-value>)",
            300: "rgb(var(--color-zinc-300) / <alpha-value>)",
            400: "rgb(var(--color-zinc-400) / <alpha-value>)",
            500: "rgb(var(--color-zinc-500) / <alpha-value>)",
            600: "rgb(var(--color-zinc-600) / <alpha-value>)",
            700: "rgb(var(--color-zinc-700) / <alpha-value>)",
            800: "rgb(var(--color-zinc-800) / <alpha-value>)",
            900: "rgb(var(--color-zinc-900) / <alpha-value>)",
            950: "rgb(var(--color-zinc-950) / <alpha-value>)",
          };
          return acc;
        }, {})
      },
      keyframes: {
      scan: {
        '0%': { transform: 'translateY(-100vh)' },
        '100%': { transform: 'translateY(100vh)' },
      }
    },
    animation: {
      scan: 'scan 10s linear infinite',
    }
    },
  },
  plugins: [require("tailwindcss-animate")],
}