/** @type {import('tailwindcss').Config} */

/** Every colour resolves through a CSS variable defined in src/styles/palettes.css. */
const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: token("canvas"),
          deep: token("canvas-deep"),
        },
        surface: token("surface"),
        elevated: token("elevated"),
        line: {
          DEFAULT: token("line"),
          strong: token("line-strong"),
        },
        ink: {
          DEFAULT: token("ink"),
          muted: token("ink-muted"),
          subtle: token("ink-subtle"),
        },
        primary: {
          DEFAULT: token("primary"),
          strong: token("primary-strong"),
          fg: token("primary-fg"),
        },
        accent: token("accent"),
      },
      borderColor: {
        DEFAULT: "hsl(var(--line))",
      },
      ringColor: {
        DEFAULT: "hsl(var(--primary))",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 2px)",
        "2xl": "calc(var(--radius) + 6px)",
        "3xl": "calc(var(--radius) + 14px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 7px)",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--canvas-deep) / 0.35), 0 8px 24px -12px hsl(var(--canvas-deep) / 0.5)",
        lift: "0 2px 4px hsl(var(--canvas-deep) / 0.3), 0 18px 40px -18px hsl(var(--canvas-deep) / 0.65)",
        glow: "0 18px 44px -22px hsl(var(--primary) / 0.55), 0 0 0 1px hsl(var(--primary) / 0.14)",
        "glow-sm": "0 0 0 1px hsl(var(--primary) / 0.2), 0 6px 20px -10px hsl(var(--primary) / 0.45)",
        inset: "inset 0 1px 0 0 hsl(var(--ink) / 0.05)",
      },
      spacing: {
        sidebar: "var(--sidebar-w)",
      },
      maxWidth: {
        workspace: "1240px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "none" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "none" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.9)", opacity: "0" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        "caret-blink": {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
        },
        shimmer: {
          from: { transform: "translateX(-120%)" },
          to: { transform: "translateX(220%)" },
        },
        /* Assistant panel: rises out of the launcher it was opened from. */
        "panel-in": {
          from: { opacity: "0", transform: "translateY(18px) scale(0.94)" },
          to: { opacity: "1", transform: "none" },
        },
        "bubble-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        "typing-dot": {
          "0%, 65%, 100%": { transform: "translateY(0)", opacity: ".4" },
          "30%": { transform: "translateY(-3px)", opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 48s) linear infinite",
        "marquee-reverse":
          "marquee-reverse var(--marquee-duration, 48s) linear infinite",
        "fade-up": "fade-up 600ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 600ms ease both",
        "slide-in-left": "slide-in-left 400ms cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 320ms cubic-bezier(0.22,1,0.36,1) both",
        float: "float 9s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "caret-blink": "caret-blink 1.1s step-end infinite",
        shimmer: "shimmer 2.2s ease-in-out infinite",
        "panel-in": "panel-in 340ms cubic-bezier(0.22,1,0.36,1) both",
        "bubble-in": "bubble-in 320ms cubic-bezier(0.22,1,0.36,1) both",
        "typing-dot": "typing-dot 1.3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
