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

            // Find the first H2 within the article
            const firstH2 = article.querySelector('h2');
            if (!firstH2) {
                // If no H2 found, use the article itself
                calculateProgressFromElement(article, article);
                return;
            }

            // Bereken de voortgang vanaf het eerste H2 element
            calculateProgressFromElement(article, firstH2);
        };

        // Calculate progress with a specific starting element
        const calculateProgressFromElement = (article, startElement) => {
            // Get positions and dimensions
            const articleRect = article.getBoundingClientRect();
            const startRect = startElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const windowScrollTop = window.scrollY;

            // Calculate absolute positions relative to the document
            const articleTop = windowScrollTop + articleRect.top;
            const articleBottom = windowScrollTop + articleRect.bottom;
            const startTop = windowScrollTop + startRect.top;
            
            // The total scrollable distance from the start element to the end of the article
            const totalScrollableDistance = articleBottom - startTop;
            
            // How far we've scrolled past the start element
            const currentViewportMiddle = windowScrollTop + (viewportHeight / 2);
            
            // If we haven't reached the start element yet, progress is 0
            if (currentViewportMiddle < startTop) {
                setWidth(0);
                return;
            }
            
            // How much we've scrolled past the start element
            const scrolledPastStart = currentViewportMiddle - startTop;
            
            // Calculate percentage of progress through the content
            const percent = Math.min(100, Math.max(0, (scrolledPastStart / totalScrollableDistance) * 100));
            
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