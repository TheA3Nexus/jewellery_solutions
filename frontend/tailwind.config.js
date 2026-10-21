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
        // Luxury Bullion Gold Palette (High-Contrast 22K/24K Warm Gold for Light Showrooms)
        brand: {
          50: '#fffdf5',
          100: '#fef3c7', // Champagne highlight badge
          200: '#fde68a',
          300: '#fcd34d',
          400: '#d97706', // 22K Hallmarked Gold Accent (crisp readable on white)
          500: '#b45309', // 24K Pure Bullion Primary (royal gold button)
          600: '#92400e', // Burnished antique gold hover
          700: '#78350f',
          800: '#5a250b',
          900: '#451a03',
          950: '#fef3c7',
        },
        // 18K Rose Gold (Copper-Blush Accent)
        rosegold: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e11d48',
          600: '#be123c',
          700: '#9f1239',
          800: '#881337',
          900: '#4c0519',
          950: '#ffe4e6',
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
          950: '#f1f5f9',
        },
        // Colombian Gemstone Emerald (Verified, Paid, Hallmarked)
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#059669', // Crisp readable emerald on light backgrounds
          500: '#10b981',
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#022c22',
          950: '#d1fae5',
        },
        // Burmese Gemstone Ruby (Overdue, Auction, Meltdown alert)
        ruby: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#e11d48', // Crisp readable ruby on light backgrounds
          500: '#f43f5e',
          600: '#be123c',
          700: '#9f1239',
          800: '#881337',
          900: '#4c0519',
          950: '#ffe4e6',
        },
        // Kashmir Gemstone Sapphire (RFID Scans, Secondary Display Sync)
        sapphire: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#2563eb', // Crisp readable sapphire on light backgrounds
          500: '#3b82f6',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#dbeafe',
        },
        // Luxury Showroom Light Theme Surface Palette (Ivory Pearl & Crisp Porcelain)
        surface: {
          50: '#080705',
          100: '#12100c', // Deep rich obsidian primary text (high contrast)
          200: '#231f18', // Primary body text
          300: '#383227', // Sub-heading text
          400: '#575043', // Crisp muted helper text & column headers
          500: '#786f5c', // Input placeholders
          600: '#9c927d', // Subtle icons
          700: '#d5ccb6', // Focused borders & inputs
          800: '#e8e2d2', // Soft champagne card borders & table dividers
          850: '#f4f0e6', // Secondary button idle & muted strip
          900: '#ffffff', // Crisp porcelain white for cards, tables, modals
          950: '#f8f6f0', // Luxury warm ivory pearl showroom backdrop
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(90, 37, 11, 0.05)',
        'card': '0 2px 10px -2px rgba(90, 37, 11, 0.05), 0 1px 3px -1px rgba(90, 37, 11, 0.03)',
        'luxury': '0 4px 20px -2px rgba(180, 83, 9, 0.08), 0 2px 6px -1px rgba(180, 83, 9, 0.04)',
        'gold-glow': '0 0 15px -3px rgba(217, 119, 6, 0.35)',
      }
    },
  },
  plugins: [],
}
