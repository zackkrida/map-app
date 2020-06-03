module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./components/**/*.js', './pages/**/*.js'],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
