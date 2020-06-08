module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      './lib/**/*.{js,jsx,ts,tsx}',
    ],
  },
  theme: {
    extend: {
      colors: {
        'brand-orange': '#e6ac5c',
        'brand-navy': '#192837',
        'brand-gray': '#738799',
        'brand-green': '#6ea663',
        'brand-blue': '#5c8ae6',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
