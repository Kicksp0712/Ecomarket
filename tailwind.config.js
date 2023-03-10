module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#4F7942',
        secondary: 'blue',
        Base: 'white',
        hovers: [],
      },
    },
    screens: {
      sm: { min: '280px', max: '420px' },
      lg: { min: '421px', max: '999px' },
      md: { min: '1000px', max: '1120px' },
      xl: { min: '1121px' },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
