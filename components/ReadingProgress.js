import { useState, useEffect } from 'react';

/**
 * ReadingProgress component dat een voortgangsbalk toont die aangeeft
 * hoeveel van een artikel de gebruiker heeft gelezen.
 * 
 * @param {Object} props Component properties
 * @param {string} props.target CSS-selector voor het artikel element (default: 'article')
 * @param {string} props.color Kleur voor de voortgangsbalk (default: 'bg-blue-600')
 * @param {number} props.height Hoogte van de voortgangsbalk in pixels (default: 4)
 * @param {string} props.position Positie van de voortgangsbalk (default: 'top')
 * @param {boolean} props.showPercentage Toon het percentage (default: false)
 */
const ReadingProgress = ({
    target = 'article',
    color = 'bg-blue-600',
    height = 4,
    position = 'top',
    showPercentage = false,
}) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Functie om de voortgang te berekenen
        const calculateProgress = () => {
            const article = document.querySelector(target);

            if (!article) return;

            // Bereken de positie en afmetingen van het artikel
            const rect = article.getBoundingClientRect();

            // Bepaal het begin- en eindpunt van het zichtbare deel van het artikel
            const viewportHeight = window.innerHeight;
            const articleStart = rect.top < 0 ? 0 : rect.top;
            const windowScrollTop = window.scrollY;

            // Totale scrollbare hoogte van het artikel
            const articleHeight = article.clientHeight;

            // Hoeveel is al gescrolld? 
            const scrolled = windowScrollTop - rect.top + articleStart + viewportHeight / 2;

            // Bereken de voortgang als percentage
            const percent = Math.min(100, Math.max(0, (scrolled / articleHeight) * 100));

            setWidth(percent);
        };

        // Voeg scroll event listener toe
        window.addEventListener('scroll', calculateProgress);
        // Initiële berekening
        calculateProgress();

        // Cleanup
        return () => window.removeEventListener('scroll', calculateProgress);
    }, [target]);

    // Bepaal de positie van de voortgangsbalk
    const positionClasses = {
        top: 'top-0',
        bottom: 'bottom-0',
    };

    const positionClass = positionClasses[position] || 'top-0';

    return (
        <div className={`fixed left-0 z-50 w-full ${positionClass}`}>
            <div className={`${color} h-${height > 12 ? 12 : height} transition-all duration-100 ease-out`} style={{ width: `${width}%` }}>
                {showPercentage && (
                    <div className="absolute right-0 -bottom-6 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                        {Math.round(width)}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadingProgress;