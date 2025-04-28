import { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toon de knop als de gebruiker 300px of meer heeft gescrolled
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Event listener voor scroll
        window.addEventListener('scroll', toggleVisibility);

        // Cleanup van de event listener
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Scroll terug naar boven
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-6 right-6 
                p-3 rounded-full 
                bg-blue-600 hover:bg-blue-700
                text-white shadow-lg
                transition-opacity duration-300 z-50
                ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            aria-label="Scroll naar boven"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                />
            </svg>
        </button>
    );
};

export default ScrollToTop;