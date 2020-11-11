module.exports = {
  purge: {
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      './lib/**/*.{js,jsx,ts,tsx}',
      './types/**/*.{js,jsx,ts,tsx}',
    ],
    options: {
      whitelist: [
        'brand-orange',
        'bg-brand-orange',
        'brand-navy',
        'bg-brand-navy',
        'brand-gray',
        'bg-brand-gray',
        'brand-green',
        'bg-brand-green',
        'brand-blue',
        'bg-brand-blue',
      ],
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    extend: {
      screens: {
        md: '766px',
      },
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
