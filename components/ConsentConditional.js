import { useState, useEffect } from 'react';
import { hasConsent, COOKIE_CATEGORIES } from '../utils/cookieManager';

/**
 * ConsentConditional - Conditioneel renderen van componenten gebaseerd op cookie toestemming
 * 
 * Dit component toont alleen children als de gebruiker toestemming heeft gegeven voor
 * de opgegeven cookie categorie.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.category - Cookie categorie waarvoor toestemming moet zijn
 * @param {React.ReactNode} props.children - Components om te tonen als toestemming is gegeven
 * @param {React.ReactNode} props.fallback - (Optioneel) Component om te tonen als geen toestemming is gegeven
 */
const ConsentConditional = ({
    category,
    children,
    fallback = null
}) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Eerste render is server-side, daarna client-side
        setIsClient(true);

        // Controleer of toestemming is gegeven
        setHasPermission(hasConsent(category));

        // Luister naar wijzigingen in cookie toestemming
        const handleConsentChange = () => {
            setHasPermission(hasConsent(category));
        };

        window.addEventListener('cookieConsentChanged', handleConsentChange);

        return () => {
            window.removeEventListener('cookieConsentChanged', handleConsentChange);
        };
    }, [category]);

    // Bij server-side rendering (of eerste client render) 
    // toon niets om hydration errors te voorkomen
    if (!isClient) return null;

    // Als er toestemming is, toon children; anders fallback
    return hasPermission ? children : fallback;
};

/**
 * Functie om conditionals gemakkelijker te maken voor specifieke cookietypes
 */
export const AnalyticsConsent = (props) => (
    <ConsentConditional category={COOKIE_CATEGORIES.ANALYTICS} {...props} />
);

export const FunctionalConsent = (props) => (
    <ConsentConditional category={COOKIE_CATEGORIES.FUNCTIONAL} {...props} />
);

export const MarketingConsent = (props) => (
    <ConsentConditional category={COOKIE_CATEGORIES.MARKETING} {...props} />
);

export default ConsentConditional;