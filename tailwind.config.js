/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#030303',
          panel: '#080808',
          surface: '#0e0e0e',
          elevated: '#141414',
          border: 'rgba(255,255,255,0.06)',
          hover: 'rgba(255,255,255,0.04)',
        },
        accent: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.5)',
        'medium': '0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 32px -8px rgba(0,0,0,0.65)',
        'large': '0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px -12px rgba(0,0,0,0.75)',
        'glow': '0 0 48px -10px rgba(99,102,241,0.45)',
        'glow-sm': '0 0 24px -6px rgba(99,102,241,0.3)',
      },
      backgroundImage: {
        'mesh': 'radial-gradient(ellipse 70% 45% at 50% -15%, rgba(99,102,241,0.09), transparent), radial-gradient(ellipse 50% 35% at 100% 0%, rgba(139,92,246,0.06), transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
