// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
                textDecoration: 'underline',
              },
            },
            h1: {
              color: '#1a202c',
              fontWeight: '800',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '1em',
              lineHeight: '1.2',
            },
            h2: {
              color: '#1a202c',
              fontWeight: '700',
              fontSize: '1.5em',
              marginTop: '1.75em',
              marginBottom: '0.75em',
              lineHeight: '1.3',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '0.3em',
            },
            h3: {
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.5em',
              marginBottom: '0.6em',
              lineHeight: '1.4',
            },
            p: {
              marginTop: '1em',
              marginBottom: '1em',
              lineHeight: '1.7',
            },
            ul: {
              marginTop: '1em',
              marginBottom: '1em',
              paddingLeft: '1.5em',
              listStyleType: 'disc',
            },
            ol: {
              marginTop: '1em',
              marginBottom: '1em',
              paddingLeft: '1.5em',
              listStyleType: 'decimal',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: '#1a202c',
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#3182ce',
              paddingLeft: '1rem',
              backgroundColor: '#ebf8ff',
              borderRadius: '0 0.25rem 0.25rem 0',
              padding: '0.75em 1em',
            },
            code: {
              color: '#805ad5',
              backgroundColor: '#f7fafc',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
              fontSize: '0.9em',
            },
            pre: {
              backgroundColor: '#f7fafc',
              borderRadius: '0.375rem',
              padding: '1rem',
              overflowX: 'auto',
            },
            strong: {
              fontWeight: '600',
              color: '#1a202c',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};