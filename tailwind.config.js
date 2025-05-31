/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
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
  		backgroundImage: {
  			'messenger-gradient': 'linear-gradient(83.84deg, #0088FF -6.87%, #A033FF 26.54%, #FF5C87 58.58%)'
  		},
  		fontSize: {
  			sm: 'clamp(0.7rem, 0.09vw + 0.68rem, 0.75rem)',
  			base: 'clamp(0.88rem, 0.23vw + 0.82rem, 1rem)',
  			lg: 'clamp(1.09rem, 0.43vw + 0.98rem, 1.33rem)',
  			xl: 'clamp(1.37rem, 0.74vw + 1.18rem, 1.78rem)',
  			'2xl': 'clamp(1.71rem, 1.2vw + 1.41rem, 2.37rem)',
  			'3xl': 'clamp(2.14rem, 1.86vw + 1.67rem, 3.16rem)',
  			'4xl': 'clamp(2.67rem, 2.8vw + 1.97rem, 4.21rem)',
  			'5xl': 'clamp(3.34rem, 4.13vw + 2.3rem, 5.61rem)',
  			'6xl': 'clamp(4.17rem, 6.01vw + 2.67rem, 7.48rem)'
  		},
  		fontWeight: {
  			thin: '100',
  			extralight: '200',
  			light: '300',
  			normal: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '700',
  			extrabold: '800',
  			black: '900'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
};
