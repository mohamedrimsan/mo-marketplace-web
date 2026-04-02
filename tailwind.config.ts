import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-bebas)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A0F',
          soft: '#12121A',
          muted: '#1C1C28',
          border: '#2A2A3A',
        },
        chalk: {
          DEFAULT: '#F5F4EF',
          warm: '#EAE8E0',
          muted: '#C8C4B8',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E4C97A',
          dark: '#9B7A28',
        },
        acid: {
          DEFAULT: '#C8FF00',
          muted: '#A8D800',
        },
        crimson: {
          DEFAULT: '#FF3B3B',
          soft: '#FF6B6B',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

export default config
