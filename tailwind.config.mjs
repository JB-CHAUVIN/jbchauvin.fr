/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#C0C0C0',
        'bg-dark': '#808080',
        surface: '#D4D0C8',
        'surface-hover': '#E8E4DC',
        'surface-solid': '#ECECEC',
        sidebar: '#000080',
        'sidebar-text': '#FFFF00',
        'sidebar-link': '#00FFFF',
        ink: {
          primary: '#000000',
          secondary: '#333333',
          muted: '#666666',
        },
        accent: {
          DEFAULT: '#0000FF',
          hover: '#0000CC',
          light: '#E0E0FF',
          visited: '#800080',
          orange: '#FF6600',
        },
        border: '#808080',
        'border-light': '#FFFFFF',
        'border-dark': '#404040',
        'retro-teal': '#008080',
        'retro-navy': '#000080',
        'retro-maroon': '#800000',
        'retro-green': '#008000',
        'retro-yellow': '#FFFF00',
        'retro-red': '#FF0000',
        'retro-magenta': '#FF00FF',
      },
      fontFamily: {
        display: ['Comic Sans MS', 'Comic Sans', 'cursive'],
        body: ['Times New Roman', 'Times', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
        pixel: ['MS Sans Serif', 'Geneva', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'display-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
      boxShadow: {
        'retro-outset': 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px grey, inset 2px 2px #dfdfdf',
        'retro-inset': 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey',
        'retro-button': '1px 1px 0 #000, inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
        'retro-button-pressed': 'inset 1px 1px 0 #808080, inset -1px -1px 0 #fff',
      },
      borderRadius: {
        'none': '0',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'marquee': 'marquee 15s linear infinite',
        'rainbow': 'rainbow 3s linear infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        rainbow: {
          '0%': { color: '#FF0000' },
          '16%': { color: '#FF6600' },
          '33%': { color: '#FFFF00' },
          '50%': { color: '#00FF00' },
          '66%': { color: '#0000FF' },
          '83%': { color: '#8B00FF' },
          '100%': { color: '#FF0000' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
