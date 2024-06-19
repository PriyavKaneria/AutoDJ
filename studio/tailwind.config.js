import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'dark',
		'animate-fade-zoom-in-bottom',
		'animate-fade-zoom-out-top',
		'animate-fade-zoom-in-top',
		'animate-fade-zoom-out-bottom'
	],
	theme: {
		container: {
			center: true,
			padding: '2rem'
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			keyframes: {
				'fade-zoom-in-bottom': {
					'0%': {
						opacity: '0.5',
						transform: 'translateY(100%)',
						scale: '.75'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
						scale: '1'
					}
				},
				'fade-zoom-out-top': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)',
						scale: '1'
					},
					'100%': {
						opacity: '0.5',
						transform: 'translateY(-100%)',
						scale: '.75'
					}
				}
			},
			animation: {
				'fade-zoom-in-bottom': 'fade-zoom-in-bottom .3s ease-out',
				'fade-zoom-out-top': 'fade-zoom-out-top .3s ease-out',
				'fade-zoom-in-top': 'fade-zoom-in-bottom .3s ease-out reverse',
				'fade-zoom-out-bottom': 'fade-zoom-out-top .3s ease-out reverse'
			}
		}
	}
};

export default config;
