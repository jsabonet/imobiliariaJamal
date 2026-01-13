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
        primary: {
          DEFAULT: '#C8552B',
          50: '#F9EDE8',
          100: '#F4DCD2',
          200: '#EAB9A5',
          300: '#DF9778',
          400: '#D5744B',
          500: '#C8552B',
          600: '#A04422',
          700: '#78331A',
          800: '#502211',
          900: '#281109',
        },
        secondary: {
          DEFAULT: '#2C3E50',
          50: '#E8EAED',
          100: '#D1D6DB',
          200: '#A3ADB7',
          300: '#758493',
          400: '#475B6F',
          500: '#2C3E50',
          600: '#233240',
          700: '#1A2530',
          800: '#121920',
          900: '#090C10',
        },
        accent: {
          DEFAULT: '#27AE60',
          50: '#E8F6EF',
          100: '#D1EDDF',
          200: '#A3DBBF',
          300: '#75C99F',
          400: '#47B77F',
          500: '#27AE60',
          600: '#1F8B4D',
          700: '#17683A',
          800: '#104527',
          900: '#082313',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
