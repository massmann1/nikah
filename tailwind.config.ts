import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'hsl(var(--surface) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        text: 'hsl(var(--text) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)'
      },
      boxShadow: {
        soft: '0 12px 28px -10px rgb(0 0 0 / 0.24)',
        card: '0 10px 24px -12px rgb(0 0 0 / 0.35)'
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0.7' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        pop: 'pop 180ms ease-out',
        slideUp: 'slideUp 220ms ease-out'
      }
    }
  },
  plugins: []
};

export default config;
