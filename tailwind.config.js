/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        spotifyGreen: '#1ed760',
    },
      animation: {
        marquee: 'marquee 60s linear infinite', 
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-45%)' }, 
        },
      },
    },
  }, 
  plugins: [
    require('tailwindcss-animated')
  ],
}

