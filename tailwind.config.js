// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Primaire sans-serif font-stack
        sans: ['Inter var', 'Inter', ...defaultTheme.fontFamily.sans],
        // Secundaire serif font voor headings en quotes
        serif: ['Merriweather', 'Georgia', ...defaultTheme.fontFamily.serif],
        // Monospace font voor code elementen
        mono: ['JetBrains Mono', 'Menlo', ...defaultTheme.fontFamily.mono],
        // Display font voor grote headers
        display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        // Extra text sizes voor meer flexibiliteit
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
        // Extra tekststijlen voor speciale elementen
        'heading-hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading-large': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-medium': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.005em', fontWeight: '700' }],
        'heading-small': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      lineHeight: {
        'tighter': '1.1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      typography: {
        DEFAULT: {
          css: {
            // Basis lettertype en kleur
            color: '#333',
            fontSize: '1.125rem',
            lineHeight: '1.7',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              lineHeight: '1.7',
            },
            // Headings stylen
            h1: {
              color: '#1a202c',
              fontWeight: '800',
              fontSize: '2.5em',
              marginTop: '0',
              marginBottom: '1em',
              lineHeight: '1.2',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: '#1a202c',
              fontWeight: '700',
              fontSize: '1.75em',
              marginTop: '1.75em',
              marginBottom: '0.75em',
              lineHeight: '1.3',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-0.015em',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '0.3em',
            },
            h3: {
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '1.35em',
              marginTop: '1.5em',
              marginBottom: '0.6em',
              lineHeight: '1.4',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-0.01em',
            },
            h4: {
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '1.15em',
              marginTop: '1.5em',
              marginBottom: '0.6em',
            },
            // Link styling
            a: {
              color: '#3182ce',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: '#2c5282',
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: '2px',
              },
            },
            // Lijsten
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.625em',
              listStyleType: 'disc',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.625em',
              listStyleType: 'decimal',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              '&::marker': {
                color: '#4299e1',
                fontWeight: 'bold',
              },
            },
            // Blockquotes
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: '#1a202c',
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#3182ce',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              paddingLeft: '1rem',
              backgroundColor: '#ebf8ff',
              borderRadius: '0 0.25rem 0.25rem 0',
              padding: '1em 1.25em',
              marginBottom: '1.5em',
              position: 'relative',
              '&::before': {
                content: 'open-quote',
                position: 'absolute',
                top: '-0.5em',
                left: '-0.25em',
                fontSize: '3em',
                color: '#a0d1fa',
                fontFamily: 'serif',
                opacity: '0.5',
              },
            },
            // Code blocks
            code: {
              color: '#805ad5',
              backgroundColor: '#f7fafc',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.875em',
              fontWeight: '500',
              border: '1px solid #e2e8f0',
            },
            pre: {
              backgroundColor: '#f7fafc',
              borderRadius: '0.375rem',
              padding: '1rem',
              overflowX: 'auto',
              border: '1px solid #e2e8f0',
              marginTop: '1.5em',
              marginBottom: '1.5em',
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                border: 'none',
                fontSize: '0.875em',
                color: '#4a5568',
              },
            },
            // Tabel styling
            table: {
              fontSize: '0.9em',
              lineHeight: '1.5',
              marginTop: '1.5em',
              marginBottom: '1.5em',
              width: '100%',
              borderCollapse: 'collapse',
              thead: {
                borderBottomWidth: '2px',
                borderBottomColor: '#e2e8f0',
                th: {
                  padding: '0.75em',
                  textAlign: 'left',
                  fontSize: '0.875em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#4a5568',
                },
              },
              tbody: {
                tr: {
                  borderBottomWidth: '1px',
                  borderBottomColor: '#e2e8f0',
                  '&:last-child': {
                    borderBottomWidth: '0',
                  },
                  '&:nth-child(even)': {
                    backgroundColor: '#f7fafc',
                  },
                },
                td: {
                  padding: '0.75em',
                  fontSize: '0.9em',
                },
              },
            },
            // Overige elementen
            hr: {
              marginTop: '2em',
              marginBottom: '2em',
              border: 'none',
              borderTop: '2px solid #e2e8f0',
            },
            strong: {
              fontWeight: '600',
              color: '#1a202c',
            },
            em: {
              fontStyle: 'italic',
            },
            img: {
              borderRadius: '0.375rem',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            figure: {
              marginTop: '2em',
              marginBottom: '2em',
              figcaption: {
                fontSize: '0.875em',
                color: '#718096',
                marginTop: '0.75em',
                textAlign: 'center',
              },
            },
          },
        },
        // Extra varianten voor typo
        'lg': {
          css: {
            fontSize: '1.25rem',
            h1: {
              fontSize: '2.75em',
            },
            h2: {
              fontSize: '2em',
            },
            h3: {
              fontSize: '1.5em',
            },
          },
        },
        'xl': {
          css: {
            fontSize: '1.375rem',
            h1: {
              fontSize: '3em',
            },
            h2: {
              fontSize: '2.25em',
            },
            h3: {
              fontSize: '1.75em',
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