import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        "bg-2": "#111118",
        card: "#16161F",
        "card-2": "#1C1C28",
        surface: "#F8F9FA",
        orange: {
          DEFAULT: "#FF6B00",
          hover: "#E55A00",
          light: "#FF8C3A",
        },
        border: {
          DEFAULT: "#2A2A3A",
          light: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: { "8xl": "1280px" },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(30px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};

export default config;
