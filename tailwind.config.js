/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./components/**/*.{js,ts,jsx,tsx,mdx,html}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'accent-gradient': 'linear-gradient(90deg, rgba(78,19,179,1) 9%, rgba(245,45,133,1) 100%)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			pramary: '#F3F4F6',
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			'accent-2': '#D52FDD',
  			fonts: {
  				'title-1': '#000000',
  				'title-2': '#444444',
  				'title-3': '#777777'
  			},
  			category: {
  				cinema: '#3E62E4',
  				lecture: '#EA8918',
  				theater: '#3BA82A',
  				standup: '#E43E3E'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		screens: {
  			sm: '480px',
  			md: '768px',
  			lg: '976px',
  			xl: '1440px'
  		},
  		maxWidth: {
  			'custom-container': '77.5rem'
  		},
  		fontFamily: {
  			roboto: ['Roboto', 'sans-serif']
  		},
  		fontWeight: {
  			regular: '400',
  			medium: '500',
  			bold: '700'
  		},
  		spacing: {
  			sm: '1.25rem',
  			md: '2.5rem',
  			lg: '5rem'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)'
  		}
  	}
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
      require("tailwindcss-animate")
]
}
