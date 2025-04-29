import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, createContext } from 'react';
import { fetchAPI } from '../lib/api';
import { GET_SITE_SETTINGS, GET_SITE_OPTIONS } from '../lib/queries';
import dynamic from 'next/dynamic';
import FontLoader from '../components/FontLoader';

// Dynamisch importeren van componenten
const ScrollToTop = dynamic(() => import('../components/ScrollToTop'), { ssr: false });
const CookieConsent = dynamic(() => import('../components/CookieConsent'), { ssr: false });
const CookieManager = dynamic(() => import('../components/CookieManager'), { ssr: false });

// Nieuwe ResponsiveHeader in plaats van de oude Header
const ResponsiveHeader = dynamic(() => import('../components/ResponsiveHeader'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

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

    // Referentie naar de cookie consent component functie
    const [openCookieConsentModal, setOpenCookieConsentModal] = useState(null);

    // Maak de openCookieConsentModal functie beschikbaar voor componenten
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.openCookieConsentModal = openCookieConsentModal;
        }
    }, [openCookieConsentModal]);

    // Cookie consent handlers
    const handleAcceptAllCookies = (preferences) => {
        console.log('Alle cookies geaccepteerd:', preferences);

        // Dispatch event voor andere componenten die op cookie wijzigingen reageren
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('cookieConsentChanged', { detail: preferences });
            window.dispatchEvent(event);
        }
    };

    const handleRejectAllCookies = (preferences) => {
        console.log('Niet-essentiële cookies afgewezen:', preferences);

        // Dispatch event voor andere componenten
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('cookieConsentChanged', { detail: preferences });
            window.dispatchEvent(event);
        }
    };

    const handleSavePreferences = (preferences) => {
        console.log('Cookie voorkeuren opgeslagen:', preferences);

        // Dispatch event voor andere componenten
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('cookieConsentChanged', { detail: preferences });
            window.dispatchEvent(event);
        }
    };

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

    // Controleer of er een privacy pagina bestaat
    const hasPrivacyPage = Boolean(siteOptions?.privacyPaginaUrl);

    return (
        <SiteContext.Provider value={{ siteSettings, loading }}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{metaTitle}</title>
                <meta name="description" content={siteInfo.description} />
                <link rel="icon" href="/favicon.ico" />

                {/* Cookie vooraf verklaring voor transparantie en GDPR compliance */}
                <meta name="cookie-policy" content="By using this site, you consent to our use of necessary cookies. Additional tracking and analytics cookies will only be used with your explicit permission." />
            </Head>

            {/* Laad onze fonts */}
            <FontLoader />

            <div className="min-h-screen flex flex-col bg-gray-50">
                {/* Nieuwe Responsieve Header */}
                <ResponsiveHeader />

                {/* Page content */}
                <Component {...pageProps} />

                {/* Footer blijft ongewijzigd */}
                <Footer />

                <ScrollToTop />

                {/* Cookie Manager - initialiseert de tracking tools op basis van consent */}
                <CookieManager
                    googleAnalyticsId={siteOptions?.googleAnalyticsId}
                    facebookPixelId={siteOptions?.facebookPixelId}
                    hotjarId={siteOptions?.hotjarId}
                    cookieExpireDays={siteOptions?.cookieExpireDays || 365}
                />

                {/* Cookie Consent Banner */}
                <CookieConsent
                    privacyPageExists={hasPrivacyPage}
                    privacyPageUrl={siteOptions?.privacyPaginaUrl || '/privacy'}
                    onAcceptAll={handleAcceptAllCookies}
                    onRejectAll={handleRejectAllCookies}
                    onSavePreferences={handleSavePreferences}
                    setOpenConsentModal={setOpenCookieConsentModal}
                    cookieBannerTitle={siteOptions?.cookieBannerTitel}
                    cookieBannerText={siteOptions?.cookieBannerTekst}
                    cookieDescriptions={{
                        necessary: siteOptions?.cookieNecessaryDesc,
                        functional: siteOptions?.cookieFunctionalDesc,
                        analytics: siteOptions?.cookieAnalyticsDesc,
                        marketing: siteOptions?.cookieMarketingDesc
                    }}
                />
            </div>
        </SiteContext.Provider>
    );
}

export default MyApp;