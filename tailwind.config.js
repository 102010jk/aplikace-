/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f1117',
        card: '#1a1d27',
        'card-hover': '#1f2335',
        border: '#2a2d3e',
        accent: '#6366f1',
        'accent-hover': '#818cf8',
        muted: '#6b7280',
        'muted-light': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

