/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'primary-mahogany': '#BB4500', // Mahogany
        'secondary-white': '#EFEFEF',    // Flash White
        'accent-green': '#062b18',        // Dark Green
        'text-black': '#000000',          // Black
        mahogany: '#BB4500',
        'accent-green': '#062b18',
        'secondary-white': '#EFEFEF',
      },
      fontFamily: {
        // Using Inter as the primary font, as recommended
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
}

