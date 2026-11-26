import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--bg-paper)",
        surface: "var(--bg-surface)",
        ink: "var(--text-ink)",
        "ink-border": "var(--border-ink)",
        muted: "var(--text-muted)",
        "civic-green": "#0F5C4A",
        vermilion: "#E4492F",
        marigold: "#F2B134",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-hind-siliguri)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
