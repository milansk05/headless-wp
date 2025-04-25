import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, createContext } from 'react';
import { fetchAPI } from '../lib/api';
import { GET_SITE_SETTINGS, GET_SITE_OPTIONS } from '../lib/queries';

// Context om site-instellingen te delen tussen componenten
export const SiteContext = createContext({});

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [siteInfo, setSiteInfo] = useState({
        title: 'Mijn Blog',
        description: 'Een persoonlijke blog',
        url: 'https://mijnblog.nl'
    });
    const [siteOptions, setSiteOptions] = useState({});
    const [loading, setLoading] = useState(true);

    // Alle site-instellingen uit WordPress ophalen
    useEffect(() => {
        async function loadSiteData() {
            try {
                // Parallel requests voor betere performance
                const [settingsData, optionsData] = await Promise.all([
                    fetchAPI(GET_SITE_SETTINGS),
                    fetchAPI(GET_SITE_OPTIONS)
                ]);

                // Algemene WordPress instellingen opslaan
                if (settingsData?.generalSettings) {
                    setSiteInfo({
                        title: settingsData.generalSettings.title || 'Mijn Blog',
                        description: settingsData.generalSettings.description || 'Een persoonlijke blog',
                        url: settingsData.generalSettings.url || 'https://mijnblog.nl'
                    });
                    console.log("Algemene site-instellingen geladen:", settingsData.generalSettings.title);
                }

                // Aangepaste velden opslaan als ze beschikbaar zijn
                if (optionsData?.page?.siteSettings) {
                    setSiteOptions(optionsData.page.siteSettings);
                    console.log("Custom site-instellingen geladen van pagina:", optionsData.page.title);
                } else {
                    console.warn("Kon geen custom site-instellingen vinden. Controleer of de pagina 'over-mij' bestaat en of de ACF velden correct zijn ingesteld.");
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading site data:', error);
                setLoading(false);
            }
        }

        loadSiteData();
    }, []);

    // Scroll naar boven bij pagina navigatie
    useEffect(() => {
        const handleRouteChange = () => {
            window.scrollTo(0, 0);
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    // Meta-gegevens voor de pagina
    const metaTitle = `${siteInfo.title} - ${siteInfo.description}`;

    // Alle site-instellingen samenbrengen in één object
    const siteSettings = {
        ...siteInfo,
        ...siteOptions
    };

    return (
        <SiteContext.Provider value={{ siteSettings, loading }}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{metaTitle}</title>
                <meta name="description" content={siteInfo.description} />
                <link rel="icon" href="/favicon.ico" />

                {/* Open Graph tags */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={siteInfo.description} />
                <meta property="og:url" content={siteInfo.url} />
                <meta property="og:image" content={`${siteInfo.url}/og-image.jpg`} />

                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteInfo.description} />
                <meta name="twitter:image" content={`${siteInfo.url}/twitter-image.jpg`} />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <Component {...pageProps} />
            </div>
        </SiteContext.Provider>
    );
}

export default MyApp;