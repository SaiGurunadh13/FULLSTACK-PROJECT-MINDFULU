/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf9',
          100: '#d6f6ee',
          200: '#aeeedc',
          300: '#7bdfc5',
          400: '#42c8a8',
          500: '#1fa287',
          600: '#17856f',
          700: '#146a5a',
        },
        accent: {
          50: '#f3f3ff',
          100: '#e8e9ff',
          200: '#d4d6ff',
          500: '#7077f0',
          600: '#5a60d7',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
        success: {
          50: '#ecfdf3',
          100: '#d1fadf',
          600: '#039855',
        },
        warning: {
          50: '#fffaeb',
          100: '#fef0c7',
          600: '#b54708',
        },
      },
    },
  },
  plugins: [],
};
