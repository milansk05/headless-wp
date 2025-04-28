import React from 'react';

/**
 * CookieSettingsButton - Component om een cookie instellingen knop te tonen.
 * Kan gebruikt worden in de footer of op andere plekken in de site.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.className - Extra CSS classes
 * @param {string} props.variant - Stijlvariant (default, subtle, text)
 */
const CookieSettingsButton = ({
    className = '',
    variant = 'default'
}) => {
    // Stijlen op basis van variant
    const variantStyles = {
        default: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        subtle: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        text: 'hover:bg-gray-100 text-gray-600 hover:text-gray-800 underline'
    };

    const handleClick = () => {
        // Trigger event om cookie instellingen te openen
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('openCookieSettings');
            window.dispatchEvent(event);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`px-3 py-1 text-sm rounded transition ${variantStyles[variant] || variantStyles.default} ${className}`}
            aria-label="Cookie instellingen openen"
        >
            Cookie instellingen
        </button>
    );
};

export default CookieSettingsButton;