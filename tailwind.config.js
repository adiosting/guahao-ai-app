/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        'primary-light': '#5AC8FA',
        'primary-dark': '#0051D5',
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        'text-primary': '#000000',
        'text-secondary': '#6B6B6B',
        'background-primary': '#FFFFFF',
        'background-secondary': '#F2F2F7',
        'card-background': '#FFFFFF',
        'card-border': '#E5E5EA',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0,0,0,0.1)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      animation: {
        'progress-fill': 'progressFill 0.8s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        progressFill: {
          '0%': { 'stroke-dasharray': '0 100' },
          '100%': { 'stroke-dasharray': '100 100' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}