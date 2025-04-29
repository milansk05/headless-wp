import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navigation component voor desktop navigatie
 * 
 * @component
 * @param {Object} props Component properties
 * @param {Array} props.items Array van navigatie items
 * @param {string} props.variant Stijl variant ('primary', 'secondary', 'minimal')
 * @param {boolean} props.isScrolled Of de pagina is gescrolld
 * @param {string} props.orientation Oriëntatie van het menu ('horizontal', 'vertical')
 * @param {string} props.className Extra CSS klassen
 */
const Navigation = ({
    items = [],
    variant = 'primary',
    isScrolled = false,
    orientation = 'horizontal',
    className = '',
}) => {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef({});

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown !== null) {
                const currentRef = dropdownRef.current[activeDropdown];
                if (currentRef && !currentRef.contains(event.target)) {
                    setActiveDropdown(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    // Reset dropdown when route changes
    useEffect(() => {
        setActiveDropdown(null);
    }, [router.asPath]);

    // Handle dropdown toggle
    const toggleDropdown = (itemId) => {
        setActiveDropdown(activeDropdown === itemId ? null : itemId);
    };

    // Check if current path matches item path
    const isActive = (path) => {
        if (path === '/') {
            return router.pathname === '/';
        }
        return router.pathname.startsWith(path);
    };

    // Get base styles for items based on variant
    const getBaseStyles = () => {
        // Common styles
        const baseStyles = `rounded-md transition-all duration-200 `;

        if (orientation === 'vertical') {
            // Vertical menu styles
            return `${baseStyles} w-full text-left block mb-1 px-3 py-2 `;
        }

        // Horizontal menu styles
        switch (variant) {
            case 'secondary':
                return `${baseStyles} px-2 py-1.5 text-sm `;
            case 'minimal':
                return `${baseStyles} px-2 py-1 text-xs `;
            case 'primary':
            default:
                return `${baseStyles} px-3 py-2 `;
        }
    };

    // Get active styles for items based on variant and scrolled state
    const getActiveStyles = (itemActive) => {
        const baseStyles = getBaseStyles();

        if (itemActive) {
            return baseStyles + (isScrolled
                ? 'bg-blue-100 text-blue-700 font-medium '
                : 'bg-white/20 text-white font-medium ');
        }

        return baseStyles + (isScrolled
            ? 'text-gray-700 hover:bg-gray-100 '
            : 'text-white hover:bg-white/10 ');
    };

    // Animation variants for dropdown
    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -5,
            scale: 0.95,
            transition: { duration: 0.1, ease: 'easeOut' }
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.2, ease: 'easeOut' }
        }
    };

    // Handle keyboard navigation for dropdown
    const handleKeyDown = (e, item) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(item.id);
        } else if (e.key === 'Escape' && activeDropdown === item.id) {
            setActiveDropdown(null);
        }
    };

    // Position class for dropdown (vertical or horizontal)
    const dropdownPositionClass = orientation === 'vertical'
        ? 'left-full top-0 ml-1'
        : 'left-0 top-full mt-1';

    return (
        <nav className={`${orientation === 'horizontal' ? 'flex items-center space-x-1' : 'flex flex-col'} ${className}`}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`relative ${orientation === 'horizontal' ? '' : 'w-full'}`}
                    ref={(el) => item.children && (dropdownRef.current[item.id] = el)}
                >
                    {item.children ? (
                        // Item with dropdown
                        <>
                            <button
                                onClick={() => toggleDropdown(item.id)}
                                onKeyDown={(e) => handleKeyDown(e, item)}
                                className={`${getActiveStyles(isActive(item.path))} inline-flex items-center justify-between ${orientation === 'horizontal' ? '' : 'w-full'}`}
                                aria-expanded={activeDropdown === item.id}
                                aria-haspopup="true"
                            >
                                <span className="flex items-center">
                                    {item.icon && <span className="mr-2">{item.icon}</span>}
                                    {item.label}
                                </span>
                                <svg
                                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === item.id ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            <AnimatePresence>
                                {activeDropdown === item.id && (
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className={`absolute ${dropdownPositionClass} w-48 z-50 shadow-lg overflow-hidden ${isScrolled
                                                ? 'bg-white border border-gray-200 rounded-md'
                                                : 'bg-blue-800 border border-blue-700 rounded-md'
                                            }`}
                                    >
                                        <div className="py-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={child.path}
                                                    className={`block px-4 py-2 text-sm transition-colors ${isScrolled
                                                            ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                            : 'text-white hover:bg-blue-700'
                                                        } ${isActive(child.path) ? 'font-medium' : ''}`}
                                                >
                                                    {child.icon && <span className="mr-2">{child.icon}</span>}
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        // Regular item
                        <Link
                            href={item.path}
                            className={`${getActiveStyles(isActive(item.path))} ${orientation === 'horizontal' ? 'inline-flex' : 'flex'} items-center`}
                        >
                            {item.icon && <span className="mr-2">{item.icon}</span>}
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Navigation;