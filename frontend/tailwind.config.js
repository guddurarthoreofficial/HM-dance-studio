/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        stage: {
          black: '#0A0A0E',
          raised: '#14141C',
          line: '#232330',
        },
        gold: {
          DEFAULT: '#E3B23C',
          soft: '#F2D48A',
        },
        crimson: {
          DEFAULT: '#D93E67',
          deep: '#A32A4C',
        },
        ivory: '#F2EDE4',
        muted: '#948FA0',
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
