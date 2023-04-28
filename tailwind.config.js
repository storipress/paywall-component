module.exports = {
  content: ['index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  // scope our style within the #paywall and headless ui portal element
  // HACK: we can't configure the headless ui portal element in code
  important: ':is(#paywall, #headlessui-portal-root, .paywall-container)',
  theme: {
    boxShadow: {
      '0-layer': '0 0 0 0 rgba(0, 0, 0, 0)',
      '1-layer': '0 1px 1px 0 rgba(0, 0, 0, 0.1)',
      '2-layer': '5px 10px 30px 0 rgba(0, 0, 0, 0.15)',
      '3-layer': '5px 35px 60px 0 rgba(0, 0, 0, 0.3)',
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('tailwind-scrollbar-hide'),
  ],
}
