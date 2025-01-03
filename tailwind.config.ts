import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}' 
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
      }
    }
  },
  plugins: []
};

export default config;