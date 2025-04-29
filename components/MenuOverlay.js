import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MenuOverlay - Fullscreen menu overlay voor mobiele navigatie
 * 
 * @component
 * @param {Object} props Component properties
 * @param {boolean} props.isOpen Of het menu open is
 * @param {Function} props.onClose Functie om het menu te sluiten
 * @param {Array} props.navigationItems Array van navigatie items
 * @param {boolean} props.darkMode Of het menu in dark mode moet worden weergegeven
 * @param {string} props.logoUrl URL voor het logo in het menu
 * @param {string} props.siteTitle Titel van de site (als alternatief voor logo)
 */
const MenuOverlay = ({
    isOpen,
    onClose,
    navigationItems = [],
    darkMode = false,
    logoUrl = '',
    siteTitle = 'Mijn Blog'
}) => {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState(null);
    const menuRef = useRef(null);

    // Close when route changes
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [router.asPath, isOpen, onClose]);

    // Close on escape or outside click
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent scrolling when overlay is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Animation variants
    const overlayVariants = {
        hidden: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            }
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
                when: 'beforeChildren',
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.2,
                ease: 'easeInOut'
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        }
    };

    // Function to toggle a section
    const toggleSection = (id) => {
        setActiveSection(activeSection === id ? null : id);
    };

    // Check if current path matches navigation item
    const isActive = (path) => {
        if (path === '/') {
            return router.pathname === '/';
        }
        return router.pathname.startsWith(path);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                className={`fixed inset-0 z-50 overflow-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                    }`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
            >
                {/* Header met logo en sluitknop */}
                <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                    <div className="flex items-center">
                        {logoUrl ? (
                            <img src={logoUrl} alt={siteTitle} className="h-8" />
                        ) : (
                            <span className="text-xl font-bold">{siteTitle}</span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                            }`}
                        aria-label="Sluit menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigatie items */}
                <div className="container mx-auto p-4">
                    <nav className="py-4 space-y-2">
                        {navigationItems.map((item) => (
                            <motion.div key={item.id} className="w-full" variants={itemVariants}>
                                {item.children ? (
                                    <div className="mb-2">
                                        <button
                                            onClick={() => toggleSection(item.id)}
                                            className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-lg font-medium ${isActive(item.path)
                                                    ? darkMode
                                                        ? 'bg-gray-800 text-blue-400'
                                                        : 'bg-blue-50 text-blue-700'
                                                    : darkMode
                                                        ? 'hover:bg-gray-800'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                            aria-expanded={activeSection === item.id}
                                        >
                                            <span className="flex items-center">
                                                {item.icon && <span className="mr-3">{item.icon}</span>}
                                                {item.label}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 transform transition-transform duration-200 ${activeSection === item.id ? 'rotate-180' : ''
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <AnimatePresence>
                                            {activeSection === item.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className={`ml-4 pl-2 border-l mt-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'
                                                        }`}>
                                                        {item.children.map((child) => (
                                                            <Link
                                                                key={child.id}
                                                                href={child.path}
                                                                className={`block px-4 py-2 my-1 rounded-lg ${isActive(child.path)
                                                                        ? darkMode
                                                                            ? 'bg-gray-800 text-blue-400'
                                                                            : 'bg-blue-50 text-blue-700'
                                                                        : darkMode
                                                                            ? 'text-gray-300 hover:bg-gray-800'
                                                                            : 'text-gray-700 hover:bg-gray-100'
                                                                    }`}
                                                                onClick={onClose}
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium ${isActive(item.path)
                                                ? darkMode
                                                    ? 'bg-gray-800 text-blue-400'
                                                    : 'bg-blue-50 text-blue-700'
                                                : darkMode
                                                    ? 'hover:bg-gray-800'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        onClick={onClose}
                                    >
                                        {item.icon && <span className="mr-3">{item.icon}</span>}
                                        {item.label}
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </nav>
                </div>

                {/* Footer met extra links */}
                <div className={`sticky bottom-0 mt-auto p-4 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-600'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/contact');
                                    onClose();
                                }}
                            >
                                Contact
                            </a>
                            <a
                                href="#"
                                className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-600'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/privacy');
                                    onClose();
                                }}
                            >
                                Privacy
                            </a>
                        </div>
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg ${darkMode
                                    ? 'bg-blue-700 hover:bg-blue-800 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            Sluiten
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MenuOverlay;