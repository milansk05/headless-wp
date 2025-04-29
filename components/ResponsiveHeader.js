// components/ResponsiveHeader.js
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteContext } from '../pages/_app';
import { getBookmarks } from '../utils/bookmarkUtils';
import SearchBar from './SearchBar';
import MobileMenuBar from './MobileMenuBar';
import MobileNavigation from './MobileNavigation';
import { fetchAPI } from '../lib/api';
import { GET_ALL_POSTS } from '../lib/queries';

/**
 * ResponsiveHeader - Geïntegreerde header component met mobiele en desktop navigatie
 * en artikel dropdown
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
    const [recentPosts, setRecentPosts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    // Load recent posts for dropdown
    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const data = await fetchAPI(GET_ALL_POSTS);
                if (data?.posts?.nodes) {
                    // Take most recent 5 posts
                    setRecentPosts(data.posts.nodes.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching recent posts:', error);
            }
        };

        fetchRecentPosts();
    }, []);

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
        setDropdownOpen(false);
    }, [router.asPath]);

    // Toggle menu open/closed
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Primary Nav Links */}
                            <Link
                                href="/"
                                className={`px-3 py-2 rounded-md transition-colors ${router.pathname === '/'
                                        ? isScrolled
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'bg-white/20 text-white font-medium'
                                        : isScrolled
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Home
                            </Link>

                            {/* Blog dropdown */}
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${router.pathname.startsWith('/blog') || router.pathname.startsWith('/posts')
                                            ? isScrolled
                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                : 'bg-white/20 text-white font-medium'
                                            : isScrolled
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    Blog
                                    <svg
                                        className={`ml-1 w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className={`absolute mt-2 w-64 rounded-md shadow-lg z-50 ${isScrolled
                                            ? 'bg-white border border-gray-200'
                                            : 'bg-blue-800 border border-blue-700'
                                        }`}>
                                        <div className="py-1">
                                            <div className="px-4 py-2 border-b border-gray-200 border-opacity-20">
                                                <span className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'
                                                    }`}>
                                                    Recente Artikelen
                                                </span>
                                            </div>

                                            {recentPosts.map(post => (
                                                <Link
                                                    key={post.id}
                                                    href={`/posts/${post.slug}`}
                                                    className={`block px-4 py-2 text-sm ${isScrolled
                                                            ? 'text-gray-700 hover:bg-gray-100'
                                                            : 'text-white hover:bg-blue-700'
                                                        }`}
                                                >
                                                    {post.title}
                                                </Link>
                                            ))}

                                            <div className="border-t border-gray-200 border-opacity-20 py-1 px-4">
                                                <Link
                                                    href="/blog"
                                                    className={`block py-2 text-sm font-medium ${isScrolled
                                                            ? 'text-blue-600 hover:text-blue-800'
                                                            : 'text-blue-300 hover:text-white'
                                                        }`}
                                                >
                                                    Alle artikelen →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/over-mij"
                                className={`px-3 py-2 rounded-md transition-colors ${router.pathname === '/over-mij'
                                        ? isScrolled
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'bg-white/20 text-white font-medium'
                                        : isScrolled
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Over Mij
                            </Link>

                            <Link
                                href="/contact"
                                className={`px-3 py-2 rounded-md transition-colors ${router.pathname === '/contact'
                                        ? isScrolled
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'bg-white/20 text-white font-medium'
                                        : isScrolled
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Contact
                            </Link>

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

                                {bookmarkCount > 0 && (
                                    <span className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${isScrolled
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-white/20 text-white'
                                        }`}>
                                        {bookmarkCount > 99 ? '99+' : bookmarkCount}
                                    </span>
                                )}
                            </Link>
                        </div>

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
            {isMenuOpen && (
                <MobileNavigation
                    navigationItems={[...navigationItems, ...secondaryNavigationItems]}
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    isScrolled={isScrolled}
                    setIsMenuOpen={setIsMenuOpen}
                />
            )}

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