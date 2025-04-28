import { useState, useEffect } from 'react';
import {
    hasConsent,
    setPreferences,
    resetConsent,
    getPreferences,
    hasGivenConsent,
    COOKIE_CATEGORIES
} from '../utils/cookieManager';

/**
 * Custom hook voor het beheren van cookie consent
 * 
 * @returns {Object} Methods en state voor cookie consent management
 */
const useCookieConsent = () => {
    // Status van de consent (gegeven of niet)
    const [consentGiven, setConsentGiven] = useState(false);

    // Cookie voorkeuren
    const [preferences, setPreferencesState] = useState({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
    });

    // Initialiseer de state bij het eerste render
    useEffect(() => {
        // Is alleen relevant in browser (niet tijdens SSR)
        if (typeof window === 'undefined') return;

        // Stel consent status in
        setConsentGiven(hasGivenConsent());

        // Laad opgeslagen voorkeuren
        setPreferencesState(getPreferences());

        // Luister naar de cookieSettings event
        const handleOpenSettings = () => {
            // Dit wordt getriggerd door de openCookieSettings utility functie
            if (window.openCookieConsentModal) {
                window.openCookieConsentModal();
            }
        };

        window.addEventListener('openCookieSettings', handleOpenSettings);

        return () => {
            window.removeEventListener('openCookieSettings', handleOpenSettings);
        };
    }, []);

    /**
     * Update cookie voorkeuren
     * 
     * @param {Object} newPreferences - Nieuwe cookie voorkeuren
     */
    const updatePreferences = (newPreferences) => {
        // Update in localStorage
        const savedPrefs = setPreferences(newPreferences);

        // Update lokale state
        setConsentGiven(true);
        setPreferencesState(savedPrefs);
    };

    /**
     * Accepteer alle cookies
     */
    const acceptAll = () => {
        const allAccepted = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true
        };

        updatePreferences(allAccepted);
    };

    /**
     * Weiger alle niet-essentiële cookies
     */
    const rejectAll = () => {
        const allRejected = {
            necessary: true, // Noodzakelijk blijft aan
            functional: false,
            analytics: false,
            marketing: false
        };

        updatePreferences(allRejected);
    };

    /**
     * Reset cookie consent en voorkeuren
     */
    const resetAllConsent = () => {
        resetConsent();
        setConsentGiven(false);
        setPreferencesState({
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        });
    };

    /**
     * Controleer of consent is gegeven voor een specifieke categorie
     * 
     * @param {string} category - Cookie categorie
     * @returns {boolean} True als toestemming is gegeven
     */
    const checkConsent = (category) => {
        return hasConsent(category);
    };

    return {
        consentGiven,
        preferences,
        updatePreferences,
        acceptAll,
        rejectAll,
        resetAllConsent,
        checkConsent,
        COOKIE_CATEGORIES
    };
};

export default useCookieConsent;