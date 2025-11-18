/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: ["class"],
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
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
          6: "var(--chart-6)",
          7: "var(--chart-7)",
          8: "var(--chart-8)",
          9: "var(--chart-9)",
          10: "var(--chart-10)",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        DEFAULT: "var(--border-width)",
        thick: "var(--border-width-thick)",
        accent: "var(--border-width-accent)",
      },
      ringWidth: {
        DEFAULT: "var(--focus-ring-width)",
      },
      ringOffsetWidth: {
        DEFAULT: "var(--focus-ring-offset)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
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
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--foreground)',
            '--tw-prose-headings': 'var(--foreground)',
            '--tw-prose-lead': 'var(--muted-foreground)',
            '--tw-prose-links': 'var(--primary)',
            '--tw-prose-bold': 'var(--foreground)',
            '--tw-prose-counters': 'var(--muted-foreground)',
            '--tw-prose-bullets': 'var(--muted-foreground)',
            '--tw-prose-hr': 'var(--border)',
            '--tw-prose-quotes': 'var(--foreground)',
            '--tw-prose-quote-borders': 'var(--border)',
            '--tw-prose-captions': 'var(--muted-foreground)',
            '--tw-prose-code': 'var(--foreground)',
            '--tw-prose-pre-code': 'var(--foreground)',
            '--tw-prose-pre-bg': 'var(--muted)',
            '--tw-prose-th-borders': 'var(--border)',
            '--tw-prose-td-borders': 'var(--border)',
            '--tw-prose-invert-body': 'var(--foreground)',
            '--tw-prose-invert-headings': 'var(--foreground)',
            '--tw-prose-invert-lead': 'var(--muted-foreground)',
            '--tw-prose-invert-links': 'var(--primary)',
            '--tw-prose-invert-bold': 'var(--foreground)',
            '--tw-prose-invert-counters': 'var(--muted-foreground)',
            '--tw-prose-invert-bullets': 'var(--muted-foreground)',
            '--tw-prose-invert-hr': 'var(--border)',
            '--tw-prose-invert-quotes': 'var(--foreground)',
            '--tw-prose-invert-quote-borders': 'var(--border)',
            '--tw-prose-invert-captions': 'var(--muted-foreground)',
            '--tw-prose-invert-code': 'var(--foreground)',
            '--tw-prose-invert-pre-code': 'var(--foreground)',
            '--tw-prose-invert-pre-bg': 'var(--muted)',
            '--tw-prose-invert-th-borders': 'var(--border)',
            '--tw-prose-invert-td-borders': 'var(--border)',
          },
        },
      },
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
