/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // --- Semantic Dynamic Surface Tokens (Directly Bound to CSS Variables) ---
        surface: {
          canvas: 'var(--canvas-bg)',
          card: 'var(--surface-card)',
          hover: 'var(--surface-hover)',
          subtle: 'var(--surface-subtle)',
          border: 'var(--border-subtle)',
          input: 'var(--border-medium)',
          
          // Full backward-compatible surface scale mapped dynamically to theme tokens
          50: 'var(--text-primary)',
          100: 'var(--text-primary)',
          200: 'var(--text-secondary)',
          300: 'var(--text-subtle)',
          400: 'var(--text-muted)',
          500: 'var(--text-disabled)',
          600: 'var(--text-disabled)',
          700: 'var(--border-medium)',
          800: 'var(--border-subtle)',
          850: 'var(--surface-hover)',
          900: 'var(--surface-card)',
          950: 'var(--canvas-bg)',
        },

        // --- Dynamic Gold Bullion & Hallmark Brand Palette ---
        brand: {
          benchmark: 'var(--gold-primary)',
          accent: 'var(--gold-accent)',
          hover: 'var(--gold-hover)',
          bg: 'var(--gold-bg)',
          border: 'var(--gold-border)',
          text: 'var(--gold-text)',
          
          50: '#fffdf5',
          100: 'var(--gold-bg)',
          200: '#fde68a',
          300: 'var(--gold-accent)',
          400: 'var(--gold-accent)',
          500: 'var(--gold-primary)',
          600: 'var(--gold-hover)',
          700: '#78350f',
          800: '#5a250b',
          900: '#451a03',
          950: 'var(--gold-bg)',
        },

        // --- 18K Rose Gold ---
        rosegold: {
          accent: 'var(--rosegold-accent)',
          bg: 'var(--rosegold-bg)',
          border: 'var(--rosegold-border)',
          text: 'var(--rosegold-text)',
          300: '#fda4af',
          400: '#fb7185',
          500: 'var(--rosegold-accent)',
          600: '#be123c',
        },

        // --- 950 Platinum & 925 Silver ---
        platinum: {
          accent: 'var(--platinum-accent)',
          bg: 'var(--platinum-bg)',
          border: 'var(--platinum-border)',
          text: 'var(--platinum-text)',
          100: 'var(--platinum-bg)',
          300: 'var(--platinum-border)',
          500: 'var(--platinum-accent)',
          700: 'var(--platinum-text)',
        },

        // --- Gemstone Semantic Status Sets Bound to Theme Variables ---
        emerald: {
          50: 'var(--emerald-bg)',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: 'var(--emerald-border)',
          400: 'var(--emerald-text)',
          500: '#10b981',
          600: 'var(--emerald-text)',
          700: 'var(--emerald-text)',
          800: '#064e3b',
          900: '#022c22',
          950: 'var(--emerald-bg)',
        },

        ruby: {
          50: 'var(--ruby-bg)',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: 'var(--ruby-border)',
          400: 'var(--ruby-text)',
          500: '#f43f5e',
          600: 'var(--ruby-text)',
          700: 'var(--ruby-text)',
          800: '#881337',
          900: '#4c0519',
          950: 'var(--ruby-bg)',
        },

        rose: {
          50: 'var(--ruby-bg)',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: 'var(--ruby-border)',
          400: 'var(--ruby-text)',
          500: '#f43f5e',
          600: 'var(--ruby-text)',
          700: 'var(--ruby-text)',
          800: '#881337',
          900: '#4c0519',
          950: 'var(--ruby-bg)',
        },

        amber: {
          50: 'var(--amber-bg)',
          100: '#fef3c7',
          200: '#fde68a',
          300: 'var(--amber-border)',
          400: 'var(--amber-text)',
          500: '#f59e0b',
          600: 'var(--amber-text)',
          700: 'var(--amber-text)',
          800: 'var(--amber-text)',
          900: '#78350f',
          950: 'var(--amber-bg)',
        },

        sapphire: {
          50: 'var(--sapphire-bg)',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: 'var(--sapphire-border)',
          400: 'var(--sapphire-text)',
          500: '#3b82f6',
          600: 'var(--sapphire-text)',
          700: 'var(--sapphire-text)',
          800: '#1e3a8a',
          900: '#172554',
          950: 'var(--sapphire-bg)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'dropdown': 'var(--shadow-dropdown)',
        'gold-glow': 'var(--shadow-gold-glow)',
      }
    },
  },
  plugins: [],
}
