module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
    ],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
