import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

/**
 * Cookie Consent Component - GDPR-compliant cookie consent banner
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.privacyPageExists - Of er een privacy pagina bestaat in het systeem
 * @param {string} props.privacyPageUrl - URL naar de privacy policy pagina (default: '/privacy')
 * @param {Function} props.onAcceptAll - Callback wanneer gebruiker alle cookies accepteert
 * @param {Function} props.onRejectAll - Callback wanneer gebruiker alle cookies afwijst
 * @param {Function} props.onSavePreferences - Callback wanneer gebruiker aangepaste voorkeuren opslaat
 * @param {Function} props.setOpenConsentModal - Functie om de openConsentModal callback te registreren
 * @param {string} props.cookieBannerTitle - Titel voor de cookie banner
 * @param {string} props.cookieBannerText - Tekst voor de cookie banner
 * @param {Object} props.cookieDescriptions - Beschrijvingen van verschillende cookietypes
 */
const CookieConsent = ({
    privacyPageExists = true,
    privacyPageUrl = '/privacy',
    onAcceptAll,
    onRejectAll,
    onSavePreferences,
    setOpenConsentModal,
    cookieBannerTitle = 'Cookie voorkeuren',
    cookieBannerText = 'Deze website gebruikt cookies om je ervaring te verbeteren. Sommige cookies zijn noodzakelijk voor het functioneren van de website, terwijl andere ons helpen om de website te verbeteren door inzicht te krijgen in hoe je de website gebruikt.',
    cookieDescriptions = {
        necessary: 'Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld.',
        functional: 'Deze cookies maken persoonlijke functionaliteit mogelijk, zoals het opslaan van voorkeuren en instellingen.',
        analytics: 'Deze cookies helpen ons om te begrijpen hoe bezoekers onze website gebruiken, zodat we deze kunnen verbeteren.',
        marketing: 'Deze cookies worden gebruikt om advertenties relevanter te maken en om de effectiviteit van marketingcampagnes te meten.'
    }
}) => {
    // Status van toestemmingsbanner (verborgen of zichtbaar)
    const [isVisible, setIsVisible] = useState(false);

    // Gedetailleerde weergave voor aangepaste voorkeuren
    const [showDetails, setShowDetails] = useState(false);

    // Cookie voorkeuren
    const [preferences, setPreferences] = useState({
        necessary: true, // Altijd noodzakelijk en kan niet worden uitgeschakeld
        functional: false,
        analytics: false,
        marketing: false
    });

    /**
     * Open de modal van buitenaf
     */
    const openModal = useCallback(() => {
        setIsVisible(true);
        setShowDetails(true);
    }, []);

    // Registreer de openModal functie bij initialisatie
    useEffect(() => {
        if (setOpenConsentModal) {
            setOpenConsentModal(() => openModal);
        }
    }, [openModal, setOpenConsentModal]);

    // Bij eerste render, controleer of consent al is gegeven
    useEffect(() => {
        // Check of cookie consent al is opgeslagen
        const consentGiven = localStorage.getItem('cookieConsent');

        if (!consentGiven) {
            // Toon de banner na korte vertraging voor betere UX
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        } else {
            // Als consent al is gegeven, laad voorkeuren
            try {
                const savedPrefs = JSON.parse(localStorage.getItem('cookiePreferences'));
                if (savedPrefs) {
                    setPreferences(savedPrefs);
                }
            } catch (error) {
                console.error('Error loading cookie preferences:', error);
            }
        }
    }, []);

    // Luister naar het openCookieSettings event
    useEffect(() => {
        const handleOpenSettings = () => {
            openModal();
        };

        window.addEventListener('openCookieSettings', handleOpenSettings);

        return () => {
            window.removeEventListener('openCookieSettings', handleOpenSettings);
        };
    }, [openModal]);

    // Accepteer alle cookies
    const handleAcceptAll = () => {
        const acceptedPrefs = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true
        };

        // Sla voorkeuren op
        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('cookiePreferences', JSON.stringify(acceptedPrefs));

        // Update state
        setPreferences(acceptedPrefs);
        setIsVisible(false);

        // Callback
        if (onAcceptAll) onAcceptAll(acceptedPrefs);
    };

    // Weiger alle niet-essentiële cookies
    const handleRejectAll = () => {
        const rejectedPrefs = {
            necessary: true, // Noodzakelijk blijft aan
            functional: false,
            analytics: false,
            marketing: false
        };

        // Sla voorkeuren op
        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('cookiePreferences', JSON.stringify(rejectedPrefs));

        // Update state
        setPreferences(rejectedPrefs);
        setIsVisible(false);

        // Callback
        if (onRejectAll) onRejectAll(rejectedPrefs);
    };

    // Sla aangepaste voorkeuren op
    const handleSavePreferences = () => {
        // Sla voorkeuren op
        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));

        // Verberg banner
        setIsVisible(false);

        // Callback
        if (onSavePreferences) onSavePreferences(preferences);
    };

    // Update voorkeur wanneer checkbox wordt aangepast
    const handlePreferenceChange = (category) => {
        setPreferences(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Als component niet zichtbaar is, render niets
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white shadow-lg border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col space-y-4">
                    {/* Hoofdbericht */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">{cookieBannerTitle}</h2>
                            <p className="text-gray-600 text-sm">
                                {cookieBannerText}
                                {privacyPageExists && (
                                    <span> Lees onze <Link href={privacyPageUrl} className="text-blue-600 hover:underline">Privacyverklaring</Link> voor meer informatie.</span>
                                )}
                            </p>
                        </div>

                        {!showDetails && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setShowDetails(true)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
                                >
                                    Instellingen
                                </button>
                                <button
                                    onClick={handleRejectAll}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
                                >
                                    Alleen noodzakelijk
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Accepteer alles
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Gedetailleerde cookie instellingen */}
                    {showDetails && (
                        <div className="mt-4">
                            <div className="border rounded-lg divide-y">
                                {/* Noodzakelijke cookies */}
                                <div className="p-4 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center">
                                            <h3 className="font-medium text-gray-800">Noodzakelijke cookies</h3>
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Altijd actief</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {cookieDescriptions.necessary}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <input
                                            type="checkbox"
                                            checked={preferences.necessary}
                                            disabled
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Functionele cookies */}
                                <div className="p-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-800">Functionele cookies</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {cookieDescriptions.functional}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <input
                                            type="checkbox"
                                            checked={preferences.functional}
                                            onChange={() => handlePreferenceChange('functional')}
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Analytische cookies */}
                                <div className="p-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-800">Analytische cookies</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {cookieDescriptions.analytics}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={() => handlePreferenceChange('analytics')}
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Marketing cookies */}
                                <div className="p-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-800">Marketing cookies</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {cookieDescriptions.marketing}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={() => handlePreferenceChange('marketing')}
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap justify-end gap-2">
                                <button
                                    onClick={handleRejectAll}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
                                >
                                    Alleen noodzakelijk
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
                                >
                                    Accepteer alles
                                </button>
                                <button
                                    onClick={handleSavePreferences}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Voorkeuren opslaan
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Exporteer de component en de functie om de cookie instellingen te openen
export default CookieConsent;

// Deze functie kan van buitenaf worden gebruikt om de cookie instellingen te openen
export const openCookieSettings = () => {
    // Dispatch een custom event dat door de CookieConsent component wordt afgehandeld
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('openCookieSettings');
        window.dispatchEvent(event);
    }
};