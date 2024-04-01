import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: ["dark"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        cream: {
          DEFAULT: "#faffd8",
          100: "#515e00",
          200: "#a3bc00",
          300: "#e1ff1b",
          400: "#edff78",
          500: "#faffd8",
          600: "#fbffde",
          700: "#fcffe7",
          800: "#fdffef",
          900: "#fefff7",
        },
        mindaro: {
          DEFAULT: "#ecffb0",
          100: "#425700",
          200: "#85ad00",
          300: "#c5ff05",
          400: "#d9ff5c",
          500: "#ecffb0",
          600: "#f1ffc2",
          700: "#f4ffd1",
          800: "#f8ffe0",
          900: "#fbfff0",
        },
        ash_gray: {
          DEFAULT: "#9aa899",
          100: "#1e231e",
          200: "#3c453b",
          300: "#5a6859",
          400: "#788b76",
          500: "#9aa899",
          600: "#aebaad",
          700: "#c2cbc2",
          800: "#d7dcd6",
          900: "#ebeeeb",
        },
        ultra_violet: {
          DEFAULT: "#54577c",
          100: "#111119",
          200: "#222332",
          300: "#33344b",
          400: "#444664",
          500: "#54577c",
          600: "#70739e",
          700: "#9496b6",
          800: "#b7b9ce",
          900: "#dbdce7",
        },
        steel_blue: {
          DEFAULT: "#4a7b9d",
          100: "#0f181f",
          200: "#1d313e",
          300: "#2c495e",
          400: "#3b617d",
          500: "#4a7b9d",
          600: "#6696b7",
          700: "#8db0c9",
          800: "#b3cadb",
          900: "#d9e5ed",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
    },
  },
};

export default config;
