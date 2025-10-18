import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#06070d",
        foreground: "#f4f4ff",
        primary: {
          DEFAULT: "#7c5cff",
          foreground: "#0c0c16"
        },
        accent: {
          DEFAULT: "#1d2333",
          foreground: "#f5f7ff"
        },
        muted: {
          DEFAULT: "#0f121f",
          foreground: "#9aa0c6"
        },
        border: "#1f2538",
        input: "#1f2538",
        ring: "#7c5cff"
      },
      backgroundImage: {
        "glow-grid": "radial-gradient(circle at 20% 20%, rgba(124,92,255,0.12), transparent 45%), radial-gradient(circle at 80% 0%, rgba(0,255,255,0.1), transparent 55%), linear-gradient(180deg, rgba(9,12,24,0.95), rgba(6,7,13,0.95))"
      },
      boxShadow: {
        glow: "0 0 25px rgba(124,92,255,0.45)",
        card: "0 10px 30px -12px rgba(0,0,0,0.45)"
      },
      borderRadius: {
        xl: "1rem"
      },
      fontFamily: {
        sans: ["'Space Grotesk'", ...fontFamily.sans]
      }
    }
  },
  plugins: []
};

export default config;
