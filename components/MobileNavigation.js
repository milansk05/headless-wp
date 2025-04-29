import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookmarks } from '../utils/bookmarkUtils';

/**
 * MobileNavigation component voor mobiele menu navigatie
 * 
 * @component
 * @param {Object} props Component properties
 * @param {Array} props.navigationItems Array van navigatie items
 * @param {boolean} props.isOpen Of het menu open is
 * @param {function} props.onClose Functie om het menu te sluiten
 * @param {boolean} props.isScrolled Of de pagina is gescrolld
 * @param {function} props.setIsMenuOpen Functie om menu open/dicht te zetten
 */
const MobileNavigation = ({
    navigationItems,
    isOpen,
    onClose,
    isScrolled,
    setIsMenuOpen
}) => {
    const router = useRouter();
    const [activeSubmenuId, setActiveSubmenuId] = useState(null);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const menuRef = useRef(null);

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

    // Handle click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Check of het huidige pad overeenkomt met het navigatie-item
    const isActive = (path) => {
        if (path === '/') {
            return router.pathname === '/';
        }
        return router.pathname.startsWith(path);
    };

    // Toggle submenu
    const toggleSubmenu = (id) => {
        setActiveSubmenuId(activeSubmenuId === id ? null : id);
    };

    // Animation variants for menu
    const menuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    // Animation variants for submenu
    const submenuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    className="fixed inset-0 z-50 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Overlay backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Menu panel */}
                    <motion.div
                        className={`absolute right-0 top-0 h-full w-4/5 max-w-sm overflow-y-auto shadow-xl ${isScrolled ? 'bg-white text-gray-800' : 'bg-blue-900 text-white'
                            }`}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                    >
                        {/* Menu header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 border-opacity-20">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button
                                className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-700"
                                onClick={onClose}
                                aria-label="Sluit menu"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Main navigation */}
                        <nav className="py-4">
                            <ul className="space-y-1 px-2">
                                {navigationItems.map((item) => (
                                    <li key={item.id} className="relative">
                                        {item.children ? (
                                            // Parent item with children
                                            <>
                                                <button
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${activeSubmenuId === item.id
                                                            ? isScrolled
                                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                                : 'bg-white/20 text-white font-medium'
                                                            : isScrolled
                                                                ? 'text-gray-700 hover:bg-gray-100'
                                                                : 'text-white hover:bg-white/10'
                                                        }`}
                                                    onClick={() => toggleSubmenu(item.id)}
                                                    aria-expanded={activeSubmenuId === item.id}
                                                >
                                                    <span className="flex items-center">
                                                        {item.icon && (
                                                            <span className="mr-3">{item.icon}</span>
                                                        )}
                                                        {item.label}
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`w-4 h-4 transform transition-transform duration-200 ${activeSubmenuId === item.id ? 'rotate-180' : ''
                                                            }`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {/* Submenu */}
                                                <AnimatePresence>
                                                    {activeSubmenuId === item.id && (
                                                        <motion.ul
                                                            variants={submenuVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="hidden"
                                                            className={`mt-1 ml-5 pl-2 border-l-2 ${isScrolled ? 'border-blue-100' : 'border-white/20'
                                                                }`}
                                                        >
                                                            {item.children.map((child) => (
                                                                <li key={child.id}>
                                                                    <Link
                                                                        href={child.path}
                                                                        className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${isActive(child.path)
                                                                                ? isScrolled
                                                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                                                    : 'bg-white/10 text-white font-medium'
                                                                                : isScrolled
                                                                                    ? 'text-gray-600 hover:bg-gray-50'
                                                                                    : 'text-white/90 hover:bg-white/5'
                                                                            }`}
                                                                    >
                                                                        {child.label}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            // Regular menu item
                                            <Link
                                                href={item.path}
                                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(item.path)
                                                        ? isScrolled
                                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                                            : 'bg-white/20 text-white font-medium'
                                                        : isScrolled
                                                            ? 'text-gray-700 hover:bg-gray-100'
                                                            : 'text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {item.icon && (
                                                    <span className="mr-3">{item.icon}</span>
                                                )}
                                                {item.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}

                                {/* Bookmarks item */}
                                <li>
                                    <Link
                                        href="/bookmarks"
                                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/bookmarks')
                                                ? isScrolled
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'bg-white/20 text-white font-medium'
                                                : isScrolled
                                                    ? 'text-gray-700 hover:bg-gray-100'
                                                    : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-3"
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
                                            Favorieten
                                        </span>

                                        {bookmarkCount > 0 && (
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${isScrolled
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-white/20 text-white'
                                                }`}>
                                                {bookmarkCount > 99 ? '99+' : bookmarkCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Quick actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 border-opacity-20">
                            <Link
                                href="/zoeken"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isScrolled
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Zoeken
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileNavigation;