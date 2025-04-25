// components/Header.js
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteContext } from '../pages/_app';

const Header = () => {
    const { siteSettings } = useContext(SiteContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    // Navigatie items - je kunt deze aanpassen
    const navigationItems = [
        { id: 1, label: 'Home', path: '/' },
        { id: 2, label: 'Blog', path: '/blog' },
        { id: 3, label: 'Over Mij', path: '/over-mij' },
        { id: 4, label: 'Contact', path: '/contact' }
    ];

    // Check of de pagina scrollt om header styling aan te passen
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

    // Sluit menu wanneer een link wordt geklikt
    useEffect(() => {
        setIsMenuOpen(false);
    }, [router.asPath]);

    // Check of het huidige pad overeenkomt met het navigatie-item
    const isActive = (path) => {
        if (path === '/') {
            return router.pathname === '/';
        }
        return router.pathname.startsWith(path);
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? 'bg-white shadow-md text-gray-800'
                    : 'bg-gradient-to-r from-blue-800 to-purple-800 text-white'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Site Titel */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                    >
                        <span className={`text-2xl font-bold transition-colors ${isScrolled
                                ? 'text-blue-700 group-hover:text-blue-600'
                                : 'text-white group-hover:text-blue-100'
                            }`}>
                            {siteSettings?.title || 'Headless WP'}
                        </span>
                    </Link>

                    {/* Desktop Navigatie */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-1">
                            {navigationItems.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.path}
                                        className={`px-4 py-2 rounded-md transition-all duration-200 inline-block ${isActive(item.path)
                                                ? isScrolled
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'bg-white/20 text-white font-medium'
                                                : isScrolled
                                                    ? 'text-gray-700 hover:bg-gray-100'
                                                    : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobiele Menu Knop */}
                    <button
                        className={`md:hidden p-2 rounded-md transition-colors ${isScrolled
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-white hover:bg-white/10'
                            }`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
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

                {/* Mobiele Navigatie - Slide Down Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <nav className="py-3 mb-4">
                        <ul className="space-y-1">
                            {navigationItems.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.path}
                                        className={`block px-4 py-2 rounded-md transition-all duration-200 ${isActive(item.path)
                                                ? isScrolled
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'bg-white/20 text-white font-medium'
                                                : isScrolled
                                                    ? 'text-gray-700 hover:bg-gray-100'
                                                    : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;