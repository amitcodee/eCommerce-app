/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'zoom-out': 'zoomOut 1s ease-in-out',
        'left-to-right': 'leftToRight 1s ease-in-out',
      },
      keyframes: {
        zoomOut: {
          '0%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        leftToRight: {
          '0%': { transform: 'translateX(-10%)', opacity: '0.8' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};