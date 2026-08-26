import type { Config } from "tailwindcss";

/**
 * Breakpoints map to the responsive requirements (Req 16):
 * - mobile:  <= 767px   (default / base styles)
 * - tablet:  768px - 1023px
 * - desktop: >= 1024px
 *
 * Tailwind is mobile-first, so base styles target mobile,
 * `md` (768px) targets tablet-and-up, `lg` (1024px) targets desktop-and-up.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      // tablet breakpoint start
      md: "768px",
      // desktop breakpoint start
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#000000",
          soft: "#111111",
        },
        paper: {
          DEFAULT: "#faf9f7",
          soft: "#f0efec",
        },
        muted: "#4a4a4a",
        line: "#c5c3bc",
      },
      maxWidth: {
        editorial: "1400px",
      },
      transitionDuration: {
        // micro-interaction budget (Req 17.2): <= 300ms
        micro: "220ms",
      },
    },
  },
  plugins: [],
};

export default config;
