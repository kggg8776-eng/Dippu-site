/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: '#25D366',
        'whatsapp-dark': '#128C7E',
      },
    },
  },
  plugins: [],
}
