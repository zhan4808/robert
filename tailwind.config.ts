import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // If you create a separate components folder outside app,
    // add its path here as well.
  ],
  theme: {
    extend: {
      // Customize your gradient, fonts, etc. here
      colors: {
        // Example custom color
        brand: {
          100: '#EEFBFF',
          200: '#C7F2FF',
          300: '#9FE8FF',
          400: '#77DFFF',
          500: '#4FD5FF',
          600: '#2B9EB3',
          700: '#1F7785',
          800: '#144E57',
          900: '#0A272B'
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        }
      },
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
      },
    }
  },
  plugins: []
};

export default config;