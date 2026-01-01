/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050510", // Deep space/terminal black
        primary: "#00b894",    // 1337 Green
        secondary: "#0984e3",  // Cyber Blue
        accent: "#fdcb6e",     // Warning Yellow
        danger: "#d63031",     // Moulinette Red
        surface: "#1e1e2e",    // Card background
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"], // Terminal vibe
      },
    },
  },
  plugins: [],
}
