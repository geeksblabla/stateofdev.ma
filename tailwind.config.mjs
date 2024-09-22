/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontSize: {
      xs: "clamp(0.7038rem, 0.8082rem + -0.1348vw, 0.7813rem)",
      sm: "clamp(0.9375rem, 0.9375rem + 0vw, 0.9375rem)",
      base: "clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem)",
      lg: "clamp(1.35rem, 1.24rem + 0.55vw, 1.6663rem)",
      xl: "clamp(1.62rem, 1.4109rem + 1.0457vw, 2.2213rem)",
      "2xl": "clamp(1.9438rem, 1.5901rem + 1.7685vw, 2.9606rem)",
      "3xl": "clamp(2.3325rem, 1.771rem + 2.8076vw, 3.9469rem)",
      "4xl": "clamp(2.7994rem, 1.9433rem + 4.2804vw, 5.2606rem)"
    },
    extend: {
      fontFamily: {
        mono: ["IBM Plex Mono", "monospace"]
      },
      keyframes: {
        growBar: {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "grow-bar": "growBar 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        fadeIn: "fadeIn 1s"
      },
      container: {
        center: true,
        padding: "1.4rem"
      },
      gridTemplateRows: {
        "auto-1fr": "auto 1fr"
      },
      colors: {
        theme: {
          base: "#202020",
          text: "#ECE9E2",
          accent: "#DD2C00"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
