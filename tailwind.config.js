/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        supra: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.06)', opacity: '0.92' },
        },
      },
      animation: {
        supra: 'supra 2.8s ease-in-out infinite',
      },
      colors: {
        'supra-beige': '#F5EFE6',
        'supra-red': '#FF4136',
      }
    },
  },
  plugins: [],
}

