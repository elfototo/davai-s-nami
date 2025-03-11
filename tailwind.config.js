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
			animation: {
				blink: "blink 1.5s infinite",
				whisker: "whisker 1s infinite alternate",
			},
			keyframes: {
				blink: {
					"0%, 100%": { transform: "scaleY(1)" },
					"50%": { transform: "scaleY(0.1)" },
				},
				whisker: {
					"0%": { transform: "translateX(-2px)" },
					"100%": { transform: "translateX(2px)" },
				},
			},
			boxShadow: {
				'custom': '0px 0px 20px rgba(0, 0, 0, 0.1)',
			},
			backgroundImage: {
				'accent-gradient': 'linear-gradient(90deg, rgba(78,19,179,1) 9%, rgba(245,45,133,1) 100%)'
			},
			colors: {
				background: '#f4f4f9',
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
					theater: '#4ade80',
					standup: '#E43E3E',
					music: '#2dd4bf',
					knowlege: '#c084fc'
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
				},

			},
			screens: {
				ssm: '385px',
				sm: '480px',
				smd: '540px',
				md: '768px',
				lg: '976px',
				xl: '1440px',
				special: '1110px' // for hover effect categories
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
			},
			utilities: {
				'.unicode-bidi-isolate': {
					'unicode-bidi': 'isolate',
				},
			}
		}
	},
	plugins: [
		plugin(function ({ addBase }) {
			addBase({
				'h1': { fontSize: '1.8rem', fontWeight: 'medium', marginBottom: '2.5rem', marginTop: '5rem', color: '#333' },
				'h2': { fontSize: '1.6rem', fontWeight: 'bold' },
				'h3': { fontSize: '1.875rem', fontWeight: 'medium' },
				'h4': { fontSize: '1rem', fontWeight: 'medium' },
				'p': { fontSize: '1rem', fontWeight: 'regular' }
			});
		}),
		require("tailwindcss-animate")
	]
}
