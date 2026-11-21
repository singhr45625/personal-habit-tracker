/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F9FAFB',
          dark: '#0B0F19',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
          darker: '#0D131F',
        },
        border: {
          light: '#E5E7EB',
          dark: '#1F2937',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'monospace'
        ]
      },
      animation: {
        'pop': 'pop 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'level-up': 'levelUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.85)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        levelUp: {
          '0%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
          '50%': { transform: 'scale(1.05) translateY(-5px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
