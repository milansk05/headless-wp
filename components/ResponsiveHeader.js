import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteContext } from '../pages/_app';
import { getBookmarks } from '../utils/bookmarkUtils';
import SearchBar from './SearchBar';
import MobileMenuBar from './MobileMenuBar';
import MobileDrawer from './MobileDrawer';
import MobileNavigation from './MobileNavigation';
import MenuOverlay from './MenuOverlay';
import DesktopNavigation from './DesktopNavigation';
import dynamic from 'next/dynamic';

/**
 * ResponsiveHeader - Geïntegreerde header component met mobiele en desktop navigatie
 * 
 * @component
 */
const ResponsiveHeader = () => {
    const { siteSettings } = useContext(SiteContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [menuType, setMenuType] = useState('drawer'); // 'drawer', 'overlay', or 'fullscreen'
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    // Complete navigation structure with dropdown support
    const navigationItems = [
        { id: 1, label: 'Home', path: '/' },
        {
            id: 2,
            label: 'Blog',
            path: '/blog',
            children: [
                { id: 21, label: 'Alle berichten', path: '/blog' },
                { id: 22, label: 'Categorieën', path: '/categories' },
                { id: 23, label: 'Tags', path: '/tags' }
            ]
        },
        { id: 3, label: 'Over Mij', path: '/over-mij' },
        { id: 4, label: 'Contact', path: '/contact' }
    ];

    // Secondary navigation items
    const secondaryNavigationItems = [
        { id: 101, label: 'Dashboard', path: '/dashboard' },
        { id: 102, label: 'Privacy', path: '/privacy' },
    ];

    // MegaMenu configurations
    const megaMenuConfig = [
        {
            itemId: 2, // Blog item
            type: 'featured',
            categoriesTitle: 'Populaire categorieën',
            featuredTitle: 'Uitgelichte artikelen',
            categories: [
                { label: 'Technologie', url: '/category/technologie' },
                { label: 'Reizen', url: '/category/reizen' },
                { label: 'Koken', url: '/category/koken' },
                { label: 'Lifestyle', url: '/category/lifestyle' },
                { label: 'Gezondheid', url: '/category/gezondheid' },
                { label: 'Alle categorieën', url: '/categories' }
            ],
            featured: [
                {
                    label: 'De beste reisbestemmingen van 2025',
                    url: '/posts/beste-reisbestemmingen-2025',
                    image: '/images/travel.jpg'
                },
                {
                    label: 'Technologische trends om in de gaten te houden',
                    url: '/posts/tech-trends-2025',
                    image: '/images/tech.jpg'
                },
                {
                    label: 'Gezond leven: Tips en trucs',
                    url: '/posts/gezond-leven-tips',
                    image: '/images/health.jpg'
                },
                {
                    label: 'De lekkerste recepten voor het najaar',
                    url: '/posts/recepten-najaar',
                    image: '/images/food.jpg'
                }
            ],
            footerLinks: [
                { label: 'Nieuwste artikelen', url: '/blog?sort=newest' },
                { label: 'Populaire artikelen', url: '/blog?sort=popular' },
                { label: 'Archieven', url: '/archive' }
            ],
            ctaButton: {
                label: 'Alle artikelen',
                url: '/blog'
            }
        }
    ];

    // Check device type and set menu type based on window width
    useEffect(() => {
        const checkScreenWidth = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);

            // Choose appropriate menu type based on screen size
            if (width < 640) {
                setMenuType('fullscreen'); // Very small screens get fullscreen overlay
            } else if (width < 768) {
                setMenuType('overlay'); // Medium phones get overlay
            } else {
                setMenuType('drawer'); // Tablets and up get drawer
            }
        };

        // Initial check
        checkScreenWidth();

        // Listen for resize events
        window.addEventListener('resize', checkScreenWidth);
        return () => window.removeEventListener('resize', checkScreenWidth);
    }, []);

    // Detect scroll for header styling
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Update bookmarks count when they change
    useEffect(() => {
        const updateBookmarkCount = () => {
            if (typeof window !== 'undefined') {
                const bookmarks = getBookmarks();
                setBookmarkCount(bookmarks.length);
            }
        };

        // Initial count
        updateBookmarkCount();

        // Listen for bookmark changes
        window.addEventListener('bookmarkChanged', updateBookmarkCount);

        return () => {
            window.removeEventListener('bookmarkChanged', updateBookmarkCount);
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }, [router.asPath]);

    // Toggle menu open/closed
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Render the appropriate mobile menu based on type
    const renderMobileMenu = () => {
        switch (menuType) {
            case 'fullscreen':
                return (
                    <MenuOverlay
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        navigationItems={[...navigationItems, ...secondaryNavigationItems]}
                        darkMode={!isScrolled}
                        siteTitle={siteSettings?.title || 'Mijn Blog'}
                    />
                );
            case 'overlay':
                return (
                    <MobileDrawer
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        position="bottom"
                        className={isScrolled ? 'bg-white' : 'bg-blue-900 text-white'}
                    >
                        <MobileNavigation
                            navigationItems={[...navigationItems, ...secondaryNavigationItems]}
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                            isScrolled={isScrolled}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </MobileDrawer>
                );
            case 'drawer':
            default:
                return (
                    <MobileDrawer
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        position="right"
                        className={isScrolled ? 'bg-white' : 'bg-blue-900 text-white'}
                    >
                        <MobileNavigation
                            navigationItems={[...navigationItems, ...secondaryNavigationItems]}
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                            isScrolled={isScrolled}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </MobileDrawer>
                );
        }
    };

    return (
        <>
            <header
                className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
                        ? 'bg-white shadow-md text-gray-800'
                        : 'bg-gradient-to-r from-blue-800 to-purple-800 text-white'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Site Title */}
                        <Link
                            href="/"
                            className="flex items-center space-x-2 group"
                        >
                            <span className={`text-xl md:text-2xl font-bold transition-colors ${isScrolled
                                    ? 'text-blue-700 group-hover:text-blue-600'
                                    : 'text-white group-hover:text-blue-100'
                                }`}>
                                {siteSettings?.title || 'Headless WP'}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <DesktopNavigation
                            primaryItems={navigationItems}
                            secondaryItems={secondaryNavigationItems}
                            isScrolled={isScrolled}
                            megaMenus={megaMenuConfig}
                            layout="standard"
                            bookmarks={{ count: bookmarkCount }}
                            showSecondary={!isMobile}
                        />

                        {/* Mobile Search and Menu Buttons */}
                        <div className="flex items-center md:hidden space-x-1">
                            <button
                                className={`p-2 rounded-md transition-colors ${isScrolled
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                aria-label="Zoeken"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            <button
                                className={`p-2 rounded-md transition-colors ${isScrolled
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                                onClick={toggleMenu}
                                aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">{isMenuOpen ? "Sluit menu" : "Open menu"}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {isSearchOpen && (
                        <div className="pb-4 md:hidden animate-fade-in">
                            <SearchBar
                                className={`w-full ${isScrolled ? 'bg-gray-100' : 'bg-white/10'}`}
                                onSearch={() => setIsSearchOpen(false)}
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile Menu Components */}
            {renderMobileMenu()}

            {/* Bottom Navigation Bar for Mobile */}
            <MobileMenuBar
                items={navigationItems.slice(0, 4)}
                isScrolled={isScrolled}
                onOpenMenu={toggleMenu}
            />
        </>
    );
};

export default ResponsiveHeader;