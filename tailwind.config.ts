import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        security: {
          approved: "#10b981",
          blocked: "#ef4444",
          clearance1: "#3b82f6",
          clearance2: "#06b6d4",
          clearance3: "#eab308",
          clearance4: "#f97316",
          clearance5: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};
export default config;
