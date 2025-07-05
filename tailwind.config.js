/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [    
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          'text': '#eff4f6',
          'background': '#04151a',
          'primary': '#86cadf',
          'secondary': '#16718d',
          'accent': '#19bef0',
        },
        light: {
          'text': '#1a202c',
          'background': '#f7fafc',
          'primary': '#2b6cb0',
          'secondary': '#2c5282',
          'accent': '#63b3ed',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

