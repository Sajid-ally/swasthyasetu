/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#070b17",
        surface: "#111827",
        surfaceLight: "#182234",
        border: "#243041",
        primary: "#8b5cf6",
        primaryLight: "#a855f7",
        accent: "#06b6d4",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#94a3b8",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.25)",
      },
      animation: {
        floatSlow: "floatSlow 3s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.5s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease-out",
        spinSlow: "spinSlow 10s linear infinite",
        glowPulse: "glowPulse 2.4s ease-in-out infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        glowPulse: {
          "0%, 100%": {
            opacity: "0.65",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
        },
      },
    },
  },
  plugins: [],
};