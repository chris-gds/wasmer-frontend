/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-gray-wash': 'var(--color-light-gray-wash)',
        'wasmer-darker-grey': 'var(--color-wasmer-darker-grey)',
        'wasmer-border-grey': 'var(--color-wasmer-border-grey)',
        'input-bg': 'var(--color-input-bg)',
        'input-text': 'var(--color-input-text)',
        'wasmer-border': 'var(--color-wasmer-border)',
        'wasmer-text': 'var(--color-wasmer-text)',
        'code-bg': 'var(--color-code-bg)',
        'code-header': 'var(--color-code-header)',
        'code-text': 'var(--color-code-text)',
        'code-comment': 'var(--color-code-comment)',
        'code-keyword': 'var(--color-code-keyword)',
        'code-string': 'var(--color-code-string)',
        'code-variable': 'var(--color-code-variable)',
        'code-number': 'var(--color-code-number)',
      },
      boxShadow: {
        'code': '0px 0.4px 7.43px 0px rgba(35, 16, 68, 0), 0px 1.12px 10.03px 0px rgba(35, 16, 68, 0.016), 0px 2.69px 15.79px 0px rgba(35, 16, 68, 0.051), 0px 8.91px 38.63px 0px rgba(35, 16, 68, 0.051)',
      },
      fontFamily: {
        'gilroy': ['Gilroy', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // For consistent height tokens
      },
      fontFamily: {
        sans: ['Gilroy', 'system-ui'],
      },
    },
  },
  plugins: [],
}
