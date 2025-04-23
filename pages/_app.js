import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // Eenvoudige scroll naar boven bij pagina navigatie
    useEffect(() => {
        const handleRouteChange = () => {
            window.scrollTo(0, 0);
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Mijn Blog - Verhalen, Gedachten en Ideeën</title>
                <meta name="description" content="Een persoonlijke blog gebouwd met Next.js en WordPress" />
                <link rel="icon" href="/favicon.ico" />

                {/* Open Graph tags voor betere sociale media sharing */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Mijn Blog - Verhalen, Gedachten en Ideeën" />
                <meta property="og:description" content="Een persoonlijke blog gebouwd met Next.js en WordPress" />
                <meta property="og:url" content="https://mijndomain.nl" />
                <meta property="og:image" content="https://mijndomain.nl/og-image.jpg" />

                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Mijn Blog - Verhalen, Gedachten en Ideeën" />
                <meta name="twitter:description" content="Een persoonlijke blog gebouwd met Next.js en WordPress" />
                <meta name="twitter:image" content="https://mijndomain.nl/twitter-image.jpg" />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <Component {...pageProps} />
            </div>
        </>
    );
}

export default MyApp;