import { useState, useContext } from 'react';
import Link from 'next/link';
import { SiteContext } from '../pages/_app';

const Header = () => {
    const { siteSettings } = useContext(SiteContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hardcoded navigatie items
    const navigationItems = [
        { id: 1, label: 'Home', path: '/' },
        { id: 2, label: 'Over Mij', path: '/over-mij' },
        { id: 3, label: 'Blog', path: '/blog' },
        { id: 4, label: 'Contact', path: '/contact' }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-4 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{siteSettings?.title || 'Mijn Blog'}</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-6">
                            {navigationItems.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.path}
                                        className="hover:text-blue-200 transition py-2 border-b-2 border-transparent hover:border-blue-200"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
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

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 pb-1">
                        <ul className="space-y-2">
                            {navigationItems.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.path}
                                        className="block py-2 px-2 hover:bg-blue-700 rounded transition"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;