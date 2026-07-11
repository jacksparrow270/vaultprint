/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F8FAFC",
        vault: "#0F172A",
        ink: "#1E293B",
        muted: "#64748B",
        tech: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        secure: "#10B981",
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 70px rgba(59, 130, 246, 0.16)",
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
