import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background shades
        black: {
          DEFAULT: '#000000',
          900: '#0A0A0A',
          800: '#111111',
          700: '#1A1A1A',
          600: '#222222',
          500: '#2A2A2A',
          400: '#333333',
        },
        // Gold palette
        gold: {
          DEFAULT: '#D4AF37',
          50:  '#FFF8DC',
          100: '#FAE27C',
          200: '#F5C842',
          300: '#FFD700',
          400: '#D4AF37',
          500: '#C9A227',
          600: '#B8960C',
          700: '#9B7D0A',
          800: '#7A6208',
          900: '#5A4806',
        },
        // Semantic colors
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E5E5',
          muted: '#9CA3AF',
          disabled: '#6B7280',
        },
        // Border
        border: {
          DEFAULT: '#2A2A2A',
          accent: '#D4AF37',
          subtle: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8960C 100%)',
        'gold-gradient-h': 'linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
        'card-gradient': 'linear-gradient(145deg, #1A1A1A 0%, #111111 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
