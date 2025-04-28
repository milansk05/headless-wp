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
            {/* Font loading styles - moved the links to _document.js */}
            <style jsx global>{`
                /* Font loading states */
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
            `}</style>
        </Head>
    );
};

export default FontLoader;