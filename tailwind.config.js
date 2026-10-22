/** @type {import('tailwindcss').Config} */
// Tokens from CLONE_SPEC.md §0 (measured on siena.cx)
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: { md: '768px', tablet: '810px', desktop: '1200px' },
    extend: {
      colors: {
        ink: '#122023', 'ink-2': '#2A3639', 'ink-3': '#414D4F', 'icon-grey': '#71797B',
        'hero-bg': '#F3F0EB', cream: '#FAF7F1', sand: '#F4EDDE', 'sand-line': '#CDBCA0',
        'mono-label': '#605C53', 'ann-yellow': '#F2E59A', 'ann-cream': '#EFE5D0', coral: '#F95040',
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'sans-serif'],
        display: ['"Feature Deck Web Light"', 'sans-serif'],
        'display-italic': ['"Feature Deck Web Light Italic"', 'sans-serif'],
        'display-regular': ['"Feature Deck Web Regular"', 'sans-serif'],
        condensed: ['"Feature Deck Condensed Web Regular"', 'sans-serif'],
        serif: ['"Tiempos Text Regular"', 'serif'],
        mono: ['"Geist Mono"', 'monospace'],
        fa: ['"Font Awesome 6 Sharp Light"'],
        'fa-brands': ['"Font Awesome 6 Brands"'],
      },
      backgroundImage: {
        rainbow: 'linear-gradient(90deg, #F2E59A 0%, #FEC796 21.4087%, #FB5646 36.0976%, #827ACC 60.5158%, #2E79D8 89%, #294FBA 100%)',
      },
    },
  },
  plugins: [],
}
