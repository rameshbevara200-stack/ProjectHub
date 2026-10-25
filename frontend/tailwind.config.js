/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        finisterre: {
          bg: '#F8F7F4',        // Warm chalk/sand paper tone
          surface: '#FFFFFF',   // Pure canvas
          sand: '#EFECE6',      // Earthy sand
          border: '#E2DFD7',    // Refined stone border
          muted: '#697077',     // Slate graphite text
          dark: '#141719',      // Deep charcoal/black
          ocean: '#19323F',     // North Atlantic deep ocean
          oceanLight: '#2C4C5E',// Coastal storm blue
          rust: '#C85A32',      // Maritime safety rust / burnt orange
          rustHover: '#B34A24', // Rust hover
          sage: '#455955',      // Muted coastal pine/sage
          gold: '#C59B27',      // Cornish gorse / warning gold
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        widest: '.2em',
        tightest: '-.03em',
      },
    },
  },
  plugins: [],
};
