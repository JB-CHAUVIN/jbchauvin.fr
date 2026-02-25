/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F0E8',
        surface: '#FFFFFF',
        ink: {
          primary: '#1A1A1A',
          secondary: '#6B6B6B',
          muted: '#9B9B9B',
        },
        accent: {
          DEFAULT: '#C84B31',
          hover: '#A33D27',
          light: '#F5DDD9',
        },
        border: '#E5DDD0',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        card: '0 2px 8px rgba(26, 26, 26, 0.06), 0 1px 2px rgba(26, 26, 26, 0.04)',
        'card-hover': '0 8px 24px rgba(26, 26, 26, 0.12), 0 2px 6px rgba(26, 26, 26, 0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
