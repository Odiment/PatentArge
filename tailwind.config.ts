import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
    },

    
    extend: {
      backgroundImage: {
        explosion: 'url("/bg-explosion.png")',
        circles: 'url("/bg-circles.png")',
        circleStar: 'url("/circle-star.svg")',
        site: 'url("/site-bg.svg")',
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
      fontFamily: {
        poppins: [`var(--font-poppins)`, 'sans-serif'],
        sora: [`var(--font-sora)`, 'sans-serif'],
      },
    },

   
  },
  plugins: [
    nextui({
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            primary: '#3ecf8e',
          }, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            primary: '#3ecf8e',
          }, // dark theme colors
        },
        moderndark: {
          extend: 'dark', // <- inherit default values from dark theme
          colors: {
            background: '#0D001A',
            foreground: '#ffffff',
            primary: {
              50: '#3B096C', //mor
              100: '#520F83',
              200: '#7318A2',
              300: '#9823C2',
              400: '#c031e2',
              500: '#DD62ED',
              600: '#F182F6',
              700: '#FCADF9',
              800: '#FDD5F9',
              900: '#FEECFE',
              DEFAULT: '#DD62ED', //pembe
              foreground: '#ffffff',
            },
            focus: '#F182F6',
          },
          layout: {
            disabledOpacity: '0.3',
            radius: {
              small: '1px',
              medium: '2px',
              large: '4px',
            },
            borderWidth: {
              small: '1px',
              medium: '2px',
              large: '3px',
            },
          },
        },
        retrolight: {
          // <- inherit default values from dark theme
          colors: {
            primary: '#854d0e',
            secondary: '#EE457E',
            background: '#F4E8D1',
          },
        },
        // <- inherit default values from dark theme
        retrodark: {
          colors: {
            primary: '#854d0e', //kahverengi
            secondary: '#EE457E',
            background: '#E1CA9E',
          },
        },
        emeraldlight: {
          // <- inherit default values from dark theme
          colors: {
            primary: '#0f766e',
            secondary: '#10b981',
            background: '#a7f3d0',
          },
        },
        // <- inherit default values from dark theme
        cyanddark: {
          extend: 'dark',
          colors: {
            primary: '#22d3ee',
            secondary: '#22d3ee',
            background: '#155e75',
          },
        },
      },
    }),
  ],
}
