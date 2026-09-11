/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rubina: {
          pink: {
            50: "#FFF0F3",
            100: "#FFD6DC",
            200: "#FFADB8",
            500: "#E85D75",
            600: "#D64963",
            700: "#B83A52",
          },
          peach: {
            50: "#FFF7ED",
            100: "#FFEDD5",
            200: "#FED7AA",
            500: "#F97316",
            600: "#EA580C",
          },
          sky: {
            50: "#F0F9FF",
            100: "#E0F2FE",
            200: "#BAE6FD",
            500: "#38BDF8",
            600: "#0EA5E9",
          },
          lavender: {
            50: "#FAF5FF",
            100: "#F3E8FF",
            200: "#E9D5FF",
            500: "#A855F7",
            600: "#9333EA",
          },
          mint: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            200: "#BBF7D0",
            500: "#4ADE80",
            600: "#22C55E",
          },
          sunny: {
            50: "#FEFCE8",
            100: "#FEF9C3",
            200: "#FDE047",
            500: "#FACC15",
            600: "#EAB308",
          },
        },
        background: "#FAFAFA",
        surface: "#FFFFFF",
        ink: "#171717",
        muted: "#737373",
        line: "#E5E5E5",
      },
      fontFamily: {
        sans: ["Nunito", "system-ui", "sans-serif"],
        display: ["Quicksand", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Minimum 20px untuk anak usia 2 tahun
        base: ["1.25rem", { lineHeight: "1.6" }],
        lg: ["1.5rem", { lineHeight: "1.5" }],
        xl: ["2rem", { lineHeight: "1.4" }],
        "2xl": ["2.5rem", { lineHeight: "1.3" }],
        "3xl": ["3rem", { lineHeight: "1.2" }],
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.06)",
        card: "0 4px 16px rgba(0,0,0,0.08)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.85" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
