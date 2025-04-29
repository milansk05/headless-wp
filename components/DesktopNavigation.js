import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navigation from './Navigation';

/**
 * DesktopNavigation - Component voor de desktop navigatie
 * Ondersteunt een primary, secondary en mega menu navigatie structuur
 * 
 * @component
 * @param {Object} props Component properties
 * @param {Array} props.primaryItems Primaire navigatie items
 * @param {Array} props.secondaryItems Secundaire navigatie items (kleiner, boven of onder primary)
 * @param {boolean} props.isScrolled Of de pagina is gescrolld
 * @param {Array} props.megaMenus Array van mega menu configuraties per navigatie item
 * @param {string} props.layout Layout van de navigatie ('standard', 'centered', 'split')
 * @param {Object} props.bookmarks Bookmarks object voor favorietenknop
 * @param {boolean} props.showSecondary Of de secundaire navigatie getoond moet worden
 */
const DesktopNavigation = ({
    primaryItems = [],
    secondaryItems = [],
    isScrolled = false,
    megaMenus = [], // Array van mega menu's gekoppeld aan primary items
    layout = 'standard',
    bookmarks = { count: 0 },
    showSecondary = true,
}) => {
    const router = useRouter();
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const megaMenuTimeoutRef = useRef(null);
    const megaMenuRef = useRef(null);

    // Handle click outside to close mega menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
                setActiveMegaMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (megaMenuTimeoutRef.current) {
                clearTimeout(megaMenuTimeoutRef.current);
            }
        };
    }, []);

    // Close mega menu when route changes
    useEffect(() => {
        setActiveMegaMenu(null);
    }, [router.asPath]);

    // Handle hover for mega menu
    const handleMegaMenuHover = (itemId) => {
        if (megaMenuTimeoutRef.current) {
            clearTimeout(megaMenuTimeoutRef.current);
        }
        setActiveMegaMenu(itemId);
    };

    // Handle mouse leave for mega menu with delay
    const handleMegaMenuLeave = () => {
        megaMenuTimeoutRef.current = setTimeout(() => {
            setActiveMegaMenu(null);
        }, 300);
    };

    // Find mega menu config for an item
    const findMegaMenu = (itemId) => {
        return megaMenus.find(menu => menu.itemId === itemId);
    };

    // Render mega menu content
    const renderMegaMenu = (itemId) => {
        const megaMenu = findMegaMenu(itemId);
        if (!megaMenu) return null;

        return (
            <div
                className={`absolute left-0 right-0 z-40 mx-auto w-full max-w-7xl p-6 shadow-xl transition-all ${isScrolled ? 'bg-white border-t border-gray-200' : 'bg-gradient-to-br from-blue-900 to-indigo-900 border-t border-blue-800'
                    }`}
                onMouseEnter={() => handleMegaMenuHover(itemId)}
                onMouseLeave={handleMegaMenuLeave}
                ref={megaMenuRef}
            >
                {megaMenu.type === 'columns' && (
                    <div className="grid grid-cols-4 gap-6">
                        {megaMenu.columns.map((column, idx) => (
                            <div key={idx} className="space-y-4">
                                <h3 className={`text-lg font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                                    {column.title}
                                </h3>
                                <ul className="space-y-2">
                                    {column.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.url}
                                                className={`block text-sm ${isScrolled
                                                        ? 'text-gray-700 hover:text-blue-600'
                                                        : 'text-gray-200 hover:text-white'
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {megaMenu.type === 'featured' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <h3 className={`text-lg font-medium mb-4 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                                {megaMenu.categoriesTitle || 'Categorieën'}
                            </h3>
                            <ul className="space-y-2">
                                {megaMenu.categories.map((category, catIdx) => (
                                    <li key={catIdx}>
                                        <Link
                                            href={category.url}
                                            className={`block text-sm ${isScrolled
                                                    ? 'text-gray-700 hover:text-blue-600'
                                                    : 'text-gray-200 hover:text-white'
                                                }`}
                                        >
                                            {category.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2">
                            <h3 className={`text-lg font-medium mb-4 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                                {megaMenu.featuredTitle || 'Uitgelicht'}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {megaMenu.featured.map((item, featureIdx) => (
                                    <Link key={featureIdx} href={item.url} className="group">
                                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.label}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            )}
                                        </div>
                                        <h4 className={`text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'
                                            } group-hover:underline`}>
                                            {item.label}
                                        </h4>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mega menu footer */}
                {megaMenu.footerLinks && (
                    <div className={`mt-6 pt-4 border-t ${isScrolled ? 'border-gray-200' : 'border-blue-800'} flex justify-between`}>
                        <div className="flex space-x-4">
                            {megaMenu.footerLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`text-sm ${isScrolled
                                            ? 'text-gray-600 hover:text-blue-600'
                                            : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        {megaMenu.ctaButton && (
                            <Link
                                href={megaMenu.ctaButton.url}
                                className={`text-sm px-4 py-2 rounded-md ${isScrolled
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-white hover:bg-gray-100 text-blue-900'
                                    }`}
                            >
                                {megaMenu.ctaButton.label}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Render main navigation based on layout
    const renderMainNavigation = () => {
        switch (layout) {
            case 'centered':
                return (
                    <div className="flex justify-center relative">
                        <Navigation
                            items={primaryItems}
                            variant="primary"
                            isScrolled={isScrolled}
                            className="mx-auto"
                        />
                    </div>
                );
            case 'split':
                // Split navigation with logo in the middle
                const midPoint = Math.ceil(primaryItems.length / 2);
                const leftItems = primaryItems.slice(0, midPoint);
                const rightItems = primaryItems.slice(midPoint);

                return (
                    <div className="flex justify-between items-center w-full">
                        <Navigation
                            items={leftItems}
                            variant="primary"
                            isScrolled={isScrolled}
                        />
                        <div className="mx-4">
                            {/* Logo placeholder if needed */}
                        </div>
                        <Navigation
                            items={rightItems}
                            variant="primary"
                            isScrolled={isScrolled}
                        />
                    </div>
                );
            case 'standard':
            default:
                return (
                    <Navigation
                        items={primaryItems}
                        variant="primary"
                        isScrolled={isScrolled}
                    />
                );
        }
    };

    // Function to check if an item has a mega menu
    const hasMegaMenu = (itemId) => {
        return megaMenus.some(menu => menu.itemId === itemId);
    };

    // Render primary navigation with mega menu hover handlers
    const renderPrimaryWithMegaMenu = () => {
        return (
            <div className="flex items-center space-x-1">
                {primaryItems.map(item => (
                    <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() => hasMegaMenu(item.id) && handleMegaMenuHover(item.id)}
                        onMouseLeave={() => hasMegaMenu(item.id) && handleMegaMenuLeave()}
                    >
                        <Link
                            href={item.path}
                            className={`px-3 py-2 rounded-md transition-all duration-200 inline-block ${router.pathname.startsWith(item.path)
                                    ? isScrolled
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'bg-white/20 text-white font-medium'
                                    : isScrolled
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {item.label}
                            {hasMegaMenu(item.id) && (
                                <svg
                                    className="inline-block ml-1 w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </Link>
                    </div>
                ))}

                {/* Bookmarks Button */}
                <Link
                    href="/bookmarks"
                    className={`relative px-3 py-2 rounded-md transition-all duration-200 inline-flex items-center ${isScrolled
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-white hover:bg-white/10'
                        }`}
                    aria-label="Mijn favorieten"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>

                    <span className="hidden lg:inline">Favorieten</span>

                    {bookmarks.count > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${isScrolled
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-white/20 text-white'
                            }`}>
                            {bookmarks.count > 99 ? '99+' : bookmarks.count}
                        </span>
                    )}
                </Link>
            </div>
        );
    };

    return (
        <div className="hidden md:block">
            {/* Secondary navigation (if enabled) */}
            {showSecondary && secondaryItems.length > 0 && (
                <div className={`border-b ${isScrolled ? 'border-gray-200' : 'border-white/10'}`}>
                    <div className="container mx-auto px-4">
                        <div className="flex justify-end py-1">
                            <Navigation
                                items={secondaryItems}
                                variant="secondary"
                                isScrolled={isScrolled}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Primary navigation */}
            <div className="container mx-auto px-4">
                <div className="py-2">
                    {megaMenus.length > 0 ? renderPrimaryWithMegaMenu() : renderMainNavigation()}
                </div>
            </div>

            {/* Active mega menu */}
            {activeMegaMenu !== null && renderMegaMenu(activeMegaMenu)}
        </div>
    );
};

export default DesktopNavigation;