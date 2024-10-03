/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./components/**/*.{js,ts,jsx,tsx,mdx,html}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'accent-gradient': 'linear-gradient(90deg, rgba(78,19,179,1) 9%, rgba(245,45,133,1) 100%)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // main colors
        'pramary': '#F3F4F6',
        'secondary': '#ffffff',
        // filter
        'accent-2': '#D52FDD',
        fonts: {
          'title-1': '#000000',
          'title-2': '#444444',
          'title-3': '#777777',
        },
        category: {
          'cinema': '#3E62E4',
          'lecture': '#EA8918',
          'theater': '#3BA82A',
          'standup': '#E43E3E'
        }
      },
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '976px',
        'xl': '1440px'
      },
      maxWidth: {
        'custom-container': '77.5rem', // Добавляем кастомный контейнер
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], 
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        bold: 700,     
      },
      spacing: {
        'sm': '1.25rem',
        'md': '2.5rem',
        'lg': '5rem'
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem'
      }
    },
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        'h1': { fontSize: '2.25rem', fontWeight: 'medium', marginBottom: '2.5rem', marginTop: '5rem' },
        'h2': { fontSize: '1.5rem', fontWeight: 'bold'},
        'h3': { fontSize: '1.875rem', fontWeight: 'medium'},
        'p': {fontSize: '0.8rem', fontWeight: 'regular'}
      });
    }),
  ]
}
