/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0a',
        chalk: '#f5f5f5',
        neon: '#ccff00',
        electric: '#ff0055',
      },
      fontFamily: {
        display: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(204, 255, 0, 0.4), 0 0 48px rgba(204, 255, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
