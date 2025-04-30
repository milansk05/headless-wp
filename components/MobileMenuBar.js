import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * MobileMenuBar - Fixed bottom navigation voor mobiele apparaten
 * 
 * @component
 * @param {Object} props Component properties
 * @param {Array} props.items Array van navigatie items
 * @param {boolean} props.isScrolled Of de pagina is gescrolld
 * @param {Function} props.onOpenMenu Functie om het volledige menu te openen
 */
const MobileMenuBar = ({
    items = [],
    isScrolled = false,
    onOpenMenu
}) => {
    const [activeItem, setActiveItem] = useState(null);
    const [showBar, setShowBar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Toon/verberg de navigatiebalk afhankelijk van scroll richting
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Als we meer dan 150px van de top zijn en naar beneden scrollen
            if (currentScrollY > 150 && currentScrollY > lastScrollY) {
                setShowBar(false);
            } else {
                setShowBar(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Max 5 items in de mobile bar (rest in menu)
    const visibleItems = items.slice(0, 4); // 4 items + menu button

    return (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${showBar ? 'translate-y-0' : 'translate-y-full'
            } ${isScrolled ? 'bg-white border-t border-gray-200' : 'bg-blue-900 border-t border-blue-800'}`}>
            <div className="flex justify-around items-center h-16">
                {visibleItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={`flex flex-col items-center justify-center w-full h-full ${activeItem === item.id
                                ? isScrolled
                                    ? 'text-blue-600'
                                    : 'text-white'
                                : isScrolled
                                    ? 'text-gray-600'
                                    : 'text-blue-200'
                            }`}
                        onClick={() => setActiveItem(item.id)}
                    >
                        <div className="w-6 h-6 flex items-center justify-center">
                            {item.icon || (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                            item.label.toLowerCase() === 'home'
                                                ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                : item.label.toLowerCase() === 'blog'
                                                    ? "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                                    : item.label.toLowerCase() === 'over mij' || item.label.toLowerCase() === 'over'
                                                        ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        : item.label.toLowerCase() === 'contact'
                                                            ? "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                            : "M4 6h16M4 12h16M4 18h16" // Default icon
                                        }
                                    />
                                </svg>
                            )}
                        </div>
                        <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                ))}

                {/* Menu button altijd als laatste */}
                <button
                    className={`flex flex-col items-center justify-center w-full h-full ${
                        isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-blue-200 hover:text-white'
                    }`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Bottom menu button clicked");
                        onOpenMenu();
                    }}
                    aria-label="Open menu"
                    type="button"
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <span className="text-xs mt-1">Menu</span>
                </button>
            </div>
        </div>
    );
};

export default MobileMenuBar;