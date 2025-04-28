import { useEffect } from 'react';
import Head from 'next/head';

const FontLoader = () => {
    useEffect(() => {
        // Voeg className toe aan body element wanneer fonts zijn geladen
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
            });
        } else {
            // Fallback voor browsers die document.fonts.ready niet ondersteunen
            setTimeout(() => {
                document.body.classList.add('fonts-loaded');
            }, 500);
        }
    }, []);

    return (
        <Head>
            {/* 
        We gebruiken hier link elementen voor de fontstijlen in de head.
        In een productie applicatie is het beter om Next.js Font Optimization te gebruiken:
        https://nextjs.org/docs/basic-features/font-optimization
      */}
            <link
                rel="preconnect"
                href="https://fonts.googleapis.com"
                crossOrigin="anonymous"
            />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
                rel="stylesheet"
            />
            <style jsx global>{`
        /* Font loading states */
        .font-loading {
          /* Optioneel: toon een standaard font tijdens het laden van webfonts */
        }
        
        .fonts-loaded h1, 
        .fonts-loaded h2, 
        .fonts-loaded h3, 
        .fonts-loaded h4, 
        .fonts-loaded h5, 
        .fonts-loaded h6 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .fonts-loaded {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        .fonts-loaded blockquote {
          font-family: 'Merriweather', Georgia, serif;
        }
        
        .fonts-loaded code, 
        .fonts-loaded pre {
          font-family: 'JetBrains Mono', monospace;
        }
        
        /* Flash of unstyled text (FOUT) control */
        .font-loading * {
          opacity: 0.99; /* Kleine verandering in opaciteit voor betere tekst rendering */
        }
        
        /* Smooth transition wanneer fonts geladen zijn */
        body {
          transition: opacity 0.1s ease;
        }
        
        .fonts-loaded body {
          opacity: 1;
        }
      `}</style>
        </Head>
    );
};

export default FontLoader;