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
        // Primary 22K/24K Bullion & Showroom Gold
        brand: {
          50: '#fffdf5',
          100: '#fef8e2',
          200: '#fcebb5',
          300: '#f9d97b',
          400: '#f5c242', // 22K Hallmarked Gold Highlight
          500: '#e5a817', // 24K Pure Bullion Primary
          600: '#bf810a',
          700: '#965f0c',
          800: '#7c4d11',
          900: '#683f13',
          950: '#3c2105',
        },
        // 18K Rose Gold (Copper-Blush)
        rosegold: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        // 950 Platinum & 925 Sterling Silver
        platinum: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Colombian Gemstone Emerald (Verified, Paid, Hallmarked)
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
        },
        // Burmese Gemstone Ruby (Overdue, Auction, Meltdown alert)
        ruby: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        // Kashmir Gemstone Sapphire (RFID Scans, Secondary Display Sync)
        sapphire: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Deep Obsidian & Velvet Showroom Surface Palette
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#141c2e', // Deep velvet card interior
          900: '#0d1322', // Card background
          950: '#060a12', // Pure showroom display backdrop
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px -3px rgba(245, 194, 66, 0.25)',
        'emerald-glow': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'ruby-glow': '0 0 15px -3px rgba(244, 63, 94, 0.25)',
      }
    },
  },
  plugins: [],
}
