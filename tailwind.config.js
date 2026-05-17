/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-950': '#060A10',
        'bg-900': '#080C14',
        'bg-800': '#0D1424',
        'bg-700': '#111C30',
        'neon-green': '#00FF9D',
        'neon-cyan': '#0EA5E9',
        'neon-pink': '#FF0066',
        'neon-amber': '#F59E0B',
        'neon-violet': '#8B5CF6',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        hero: ['Michroma', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(0, 255, 157, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 157, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2.5s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 255, 157, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 157, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
