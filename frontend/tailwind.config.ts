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
        teal: {
          700: "#0F766E",
          800: "#115E59",
          50: "#F0FDFA",
        },
        amber: {
          500: "#F59E0B",
          100: "#FEF3C7",
          800: "#92400E",
        },
        emerald: {
          500: "#10B981",
        },
        red: {
          500: "#EF4444",
          600: "#DC2626",
        },
        blue: {
          500: "#3B82F6",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          800: "#1F2937",
          900: "#111827",
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      borderRadius: {
        'lg': '8px',    // Inputs
        'xl': '12px',   // Buttons
        '2xl': '16px',  // Cards / Modals
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
