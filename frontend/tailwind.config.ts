import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: "#005F73",     // Sky Blue (Primary Dark)
          primary: "#0A9396", // Teal Ocean
          accent: "#EE9B00",  // Summer Sun
          bg: "#FFF9F4",      // White Cloud (Global Background)
        },
        semantic: {
          success: "#10B981",
          error: "#EF4444",
          info: "#3B82F6",
        },
        text: {
          heading: "#0D2B2E",
          body: "#4B5563",
          placeholder: "#9CA3AF",
        },
        surface: {
          card: "#FFFFFF",
          border: "#E5E7EB",
        }
      },
      borderRadius: {
        'lg': '8px',    // Inputs
        'xl': '12px',   // Buttons
        '2xl': '16px',  // Cards / Modals
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
