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
        marquee: 'marquee 60s linear infinite', // Slow enough to see all users
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' }, // Start position
          '100%': { transform: 'translateX(-50%)' }, // Move only half, so the second list appears
        },
      },
    },
  }, 
  plugins: [
    require('tailwindcss-animated')
  ],
}

