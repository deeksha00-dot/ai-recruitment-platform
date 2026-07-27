/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#b8d0ff',
          300: '#8ab0ff',
          400: '#5b8bff',
          500: '#2f63f6',
          600: '#2148d1',
          700: '#1c3aa8',
          800: '#182f80',
          900: '#0f1d52',
          950: '#0a1235',
        },
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        surface: {
          light: '#f6f8fc',
          dark: '#0b1220',
        },
        card: {
          light: '#ffffff',
          dark: '#121c31',
        },
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(15, 29, 82, 0.08), 0 8px 24px -6px rgba(15, 29, 82, 0.06)',
        'soft-lg': '0 10px 40px -10px rgba(15, 29, 82, 0.18)',
        glow: '0 0 0 1px rgba(47, 99, 246, 0.15), 0 8px 30px -8px rgba(47, 99, 246, 0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out both',
        scaleIn: 'scaleIn 0.2s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
