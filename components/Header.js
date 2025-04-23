import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAPI } from '../lib/api';
import { GET_ALL_PAGES } from '../lib/queries';

const Header = () => {
    const [pages, setPages] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        async function loadPages() {
            try {
                // Laad alleen pagina's, zonder het menu te proberen
                const data = await fetchAPI(GET_ALL_PAGES);
                setPages(data.pages.nodes);
            } catch (error) {
                console.error('Error loading navigation:', error);
            }
        }

        loadPages();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-4 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">Mijn Blog</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="/" className="hover:text-blue-200 transition py-2 border-b-2 border-transparent hover:border-blue-200">
                                    Home
                                </Link>
                            </li>
                            {pages.map((page) => (
                                <li key={page.id}>
                                    <Link
                                        href={`/${page.slug}`}
                                        className="hover:text-blue-200 transition py-2 border-b-2 border-transparent hover:border-blue-200"
                                    >
                                        {page.title}
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
                            <li>
                                <Link
                                    href="/"
                                    className="block py-2 px-2 hover:bg-blue-700 rounded transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            {pages.map((page) => (
                                <li key={page.id}>
                                    <Link
                                        href={`/${page.slug}`}
                                        className="block py-2 px-2 hover:bg-blue-700 rounded transition"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {page.title}
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