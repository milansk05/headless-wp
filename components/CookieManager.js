import { useEffect } from 'react';
import useCookieConsent from '../hooks/useCookieConsent';

/**
 * CookieManager component voor het correct initialiseren van cookies
 * op basis van gebruikersvoorkeuren.
 * 
 * Dit component rendert niets zichtbaars, maar zorgt ervoor dat cookies
 * alleen worden geladen als daar toestemming voor is gegeven.
 * 
 * @component
 * @example
 * // In _app.js
 * <CookieManager 
 *   googleAnalyticsId="UA-XXXXXXXXX-X"
 *   facebookPixelId="XXXXXXXXXX"
 * />
 */
const CookieManager = ({
    googleAnalyticsId,
    facebookPixelId,
    hotjarId,
    cookieExpireDays = 365
}) => {
    const { checkConsent, COOKIE_CATEGORIES } = useCookieConsent();

    useEffect(() => {
        // Controleer consent bij component mount
        initializeTrackingTools();

        // Luister naar veranderingen in consent
        const handleConsentChanged = () => {
            initializeTrackingTools();
        };

        window.addEventListener('cookieConsentChanged', handleConsentChanged);

        return () => {
            window.removeEventListener('cookieConsentChanged', handleConsentChanged);
        };
    }, []);

    /**
     * Initialiseer tracking tools op basis van consent
     */
    const initializeTrackingTools = () => {
        // Google Analytics
        if (googleAnalyticsId && checkConsent(COOKIE_CATEGORIES.ANALYTICS)) {
            initializeGoogleAnalytics(googleAnalyticsId);
        }

        // Facebook Pixel
        if (facebookPixelId && checkConsent(COOKIE_CATEGORIES.MARKETING)) {
            initializeFacebookPixel(facebookPixelId);
        }

        // Hotjar
        if (hotjarId && checkConsent(COOKIE_CATEGORIES.ANALYTICS)) {
            initializeHotjar(hotjarId);
        }
    };

    /**
     * Initialiseer Google Analytics
     */
    const initializeGoogleAnalytics = (id) => {
        if (window.gtag) return; // Voorkom dubbele initialisatie

        // Google Analytics script laden
        const script1 = document.createElement('script');
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        script1.async = true;
        document.head.appendChild(script1);

        // Google Analytics initialiseren
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', id, {
            'anonymize_ip': true, // IP anonimiseren voor GDPR compliance
            'cookie_expires': cookieExpireDays * 24 * 60 * 60 // Cookie vervaltijd in seconden
        });

        console.log('Google Analytics geïnitialiseerd');
    };

    /**
     * Initialiseer Facebook Pixel
     */
    const initializeFacebookPixel = (id) => {
        if (window.fbq) return; // Voorkom dubbele initialisatie

        // Facebook Pixel initialiseren
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', id);
        window.fbq('track', 'PageView');

        console.log('Facebook Pixel geïnitialiseerd');
    };

    /**
     * Initialiseer Hotjar
     */
    const initializeHotjar = (id) => {
        if (window.hj) return; // Voorkom dubbele initialisatie

        // Hotjar initialiseren
        (function (h, o, t, j, a, r) {
            h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
            h._hjSettings = { hjid: id, hjsv: 6 };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script'); r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

        console.log('Hotjar geïnitialiseerd');
    };

    // Dit component rendert niets zichtbaars
    return null;
};

export default CookieManager;