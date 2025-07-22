import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // タブレット向けの画面設定
      screens: {
        tablet: '768px',
        'tablet-lg': '1024px',
        'tablet-portrait': {
          raw: '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)',
        },
        'tablet-landscape': {
          raw: '(min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)',
        },
      },
      // タブレット向けのスペーシング
      spacing: {
        'tablet-xs': '0.75rem',
        'tablet-sm': '1rem',
        'tablet-md': '1.5rem',
        'tablet-lg': '2rem',
        'tablet-xl': '3rem',
      },
      // タッチ操作向けの最小サイズ
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
      colors: {
        'carebase-bg': '#f8fafc',
        'carebase-blue-light': '#bae6fd', // ロゴの薄い青に合わせる
        'carebase-blue': '#0891b2', // ロゴの濃い青に合わせる
        'carebase-blue-dark': '#0e7490', // より深い青に調整
        'carebase-text-primary': '#1e293b',
        'carebase-text-secondary': '#64748b',
        'carebase-white': '#ffffff',
        'carebase-border': '#e2e8f0',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // タブレット向けのフォントサイズ
      fontSize: {
        'tablet-xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'tablet-sm': ['1rem', { lineHeight: '1.5rem' }],
        'tablet-base': ['1.125rem', { lineHeight: '1.75rem' }],
        'tablet-lg': ['1.25rem', { lineHeight: '1.75rem' }],
        'tablet-xl': ['1.5rem', { lineHeight: '2rem' }],
        'tablet-2xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
