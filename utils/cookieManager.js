/**
 * Utility functies voor cookie consent en GDPR-compliance 
 */

// Cookie-categorieën 
export const COOKIE_CATEGORIES = {
    NECESSARY: 'necessary',
    FUNCTIONAL: 'functional',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing'
};

/**
 * Controleer of consent is gegeven voor een specifieke cookie categorie
 * 
 * @param {string} category - Cookie categorie om te controleren
 * @returns {boolean} - True als toestemming is gegeven, anders false
 */
export const hasConsent = (category) => {
    // In browser-omgeving checken
    if (typeof window === 'undefined') return false;

    // Noodzakelijke cookies zijn altijd toegestaan
    if (category === COOKIE_CATEGORIES.NECESSARY) return true;

    try {
        // Check of consent is gegeven
        const consentGiven = localStorage.getItem('cookieConsent');
        if (!consentGiven) return false;

        // Controleer of de specifieke categorie is geaccepteerd
        const preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
        return preferences[category] === true;
    } catch (error) {
        console.error('Error checking cookie consent:', error);
        return false;
    }
};

/**
 * Stel cookie preferences in
 * 
 * @param {Object} preferences - Object met cookie voorkeuren
 */
export const setPreferences = (preferences) => {
    if (typeof window === 'undefined') return;

    try {
        // Zorg ervoor dat noodzakelijke cookies altijd aan staan
        const updatedPrefs = {
            ...preferences,
            [COOKIE_CATEGORIES.NECESSARY]: true
        };

        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('cookiePreferences', JSON.stringify(updatedPrefs));

        return updatedPrefs;
    } catch (error) {
        console.error('Error setting cookie preferences:', error);
    }
};

/**
 * Reset alle cookie voorkeuren en verwijder consent
 */
export const resetConsent = () => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem('cookieConsent');
        localStorage.removeItem('cookiePreferences');
    } catch (error) {
        console.error('Error resetting cookie consent:', error);
    }
};

/**
 * Haal alle opgeslagen voorkeuren op
 * 
 * @returns {Object} Cookie voorkeuren
 */
export const getPreferences = () => {
    if (typeof window === 'undefined') return {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
    };

    try {
        const preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
        return {
            necessary: true, // Altijd aan
            functional: preferences.functional === true,
            analytics: preferences.analytics === true,
            marketing: preferences.marketing === true
        };
    } catch (error) {
        console.error('Error getting cookie preferences:', error);
        return {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        };
    }
};

/**
 * Controleer of er überhaupt toestemming is gegeven
 * 
 * @returns {boolean} True als toestemming is gegeven
 */
export const hasGivenConsent = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('cookieConsent') === 'true';
};

export default {
    COOKIE_CATEGORIES,
    hasConsent,
    setPreferences,
    resetConsent,
    getPreferences,
    hasGivenConsent
};