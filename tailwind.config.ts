import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        panel: 'rgb(var(--panel) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        glow: 'rgb(var(--glow) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        fog: 'rgb(var(--fog) / <alpha-value>)'
      },
      boxShadow: {
        panel: '0 24px 80px rgba(0, 0, 0, 0.35)',
        stage: '0 35px 90px rgba(0, 0, 0, 0.48)'
      },
      fontFamily: {
        sans: ['"Avenir Next"', '"Segoe UI"', 'sans-serif'],
        display: ['"Iowan Old Style"', '"Times New Roman"', 'serif']
      },
      backgroundImage: {
        chrome:
          'radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%)'
      }
    }
  },
  plugins: []
};

export default config;
