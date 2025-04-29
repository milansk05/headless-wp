import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * MegaMenu component voor geavanceerde navigatie
 * 
 * @component
 * @param {Object} props Component properties
 * @param {string} props.type Type mega menu ('columns', 'featured', 'cards', 'grid')
 * @param {boolean} props.isOpen Of het menu open is
 * @param {boolean} props.isScrolled Of de pagina is gescrolld
 * @param {Function} props.onClose Functie om het menu te sluiten
 * @param {Array} props.columns Kolommen voor 'columns' type
 * @param {Array} props.categories Categorieën voor 'featured' type
 * @param {Array} props.featured Uitgelichte items voor 'featured' type
 * @param {string} props.categoriesTitle Titel voor categorieën sectie
 * @param {string} props.featuredTitle Titel voor uitgelichte items sectie
 * @param {Array} props.cards Kaarten voor 'cards' type
 * @param {Array} props.footerLinks Links in de footer
 * @param {Object} props.ctaButton CTA button in de footer
 */
const MegaMenu = ({
    type = 'columns',
    isOpen = false,
    isScrolled = false,
    onClose,
    columns = [],
    categories = [],
    featured = [],
    categoriesTitle = 'Categorieën',
    featuredTitle = 'Uitgelicht',
    cards = [],
    footerLinks = [],
    ctaButton = null,
}) => {
    const [loadImages, setLoadImages] = useState(false);
    const menuRef = useRef(null);

    // Laden van afbeeldingen uitstellen tot het menu open is voor betere performance
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setLoadImages(true);
            }, 150);
            return () => clearTimeout(timer);
        } else {
            setLoadImages(false);
        }
    }, [isOpen]);

    // Detecteer clicks buiten het menu
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

    // Detecteer Escape toets om menu te sluiten
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Animatie varianten
    const menuVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    // Render kolommen type
    const renderColumnsLayout = () => (
        <div className="grid grid-cols-4 gap-6">
            {columns.map((column, idx) => (
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
    );

    // Render featured type
    const renderFeaturedLayout = () => (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
                <h3 className={`text-lg font-medium mb-4 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    {categoriesTitle}
                </h3>
                <ul className="space-y-2">
                    {categories.map((category, catIdx) => (
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
                    {featuredTitle}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {featured.map((item, featureIdx) => (
                        <Link key={featureIdx} href={item.url} className="group">
                            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
                                {loadImages && item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        width={300}
                                        height={169}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                            </div>
                            <h4 className={`text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'
                                } group-hover:underline`}>
                                {item.label}
                            </h4>
                            {item.description && (
                                <p className={`text-xs mt-1 ${isScrolled ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                    {item.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );

    // Render cards type
    const renderCardsLayout = () => (
        <div className="grid grid-cols-3 gap-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={`rounded-lg p-5 ${isScrolled
                            ? 'bg-gray-50 hover:bg-gray-100'
                            : 'bg-white/5 hover:bg-white/10'
                        } transition-colors`}
                >
                    {card.icon && (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isScrolled
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-white/10 text-white'
                            }`}>
                            {card.icon}
                        </div>
                    )}
                    <h3 className={`text-lg font-medium mb-2 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                        {card.title}
                    </h3>
                    <p className={`text-sm mb-4 ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>
                        {card.description}
                    </p>
                    <Link
                        href={card.url}
                        className={`text-sm font-medium ${isScrolled
                                ? 'text-blue-600 hover:text-blue-800'
                                : 'text-blue-300 hover:text-white'
                            }`}
                    >
                        {card.linkText || 'Meer info'} →
                    </Link>
                </div>
            ))}
        </div>
    );

    // Render grid type
    const renderGridLayout = () => (
        <div className="grid grid-cols-4 gap-6">
            {featured.map((item, idx) => (
                <Link
                    key={idx}
                    href={item.url}
                    className="group"
                >
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                        {loadImages && item.image && (
                            <Image
                                src={item.image}
                                alt={item.label}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        )}
                    </div>
                    <h3 className={`text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'
                        } group-hover:underline`}>
                        {item.label}
                    </h3>
                </Link>
            ))}
        </div>
    );

    // Render content based on type
    const renderContent = () => {
        switch (type) {
            case 'columns':
                return renderColumnsLayout();
            case 'featured':
                return renderFeaturedLayout();
            case 'cards':
                return renderCardsLayout();
            case 'grid':
                return renderGridLayout();
            default:
                return renderColumnsLayout();
        }
    };

    // Render footer with links and CTA button
    const renderFooter = () => {
        if (!footerLinks.length && !ctaButton) return null;

        return (
            <div className={`mt-6 pt-4 border-t ${isScrolled ? 'border-gray-200' : 'border-blue-800'} flex justify-between`}>
                {footerLinks.length > 0 && (
                    <div className="flex space-x-4">
                        {footerLinks.map((link, idx) => (
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
                )}
                {ctaButton && (
                    <Link
                        href={ctaButton.url}
                        className={`text-sm px-4 py-2 rounded-md ${isScrolled
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-white hover:bg-gray-100 text-blue-900'
                            }`}
                    >
                        {ctaButton.label}
                    </Link>
                )}
            </div>
        );
    };

    // Als het menu niet geopend is, toon niets
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                ref={menuRef}
                className={`absolute left-0 right-0 z-40 mx-auto w-full max-w-7xl p-6 shadow-xl ${isScrolled
                        ? 'bg-white border-t border-gray-200'
                        : 'bg-gradient-to-br from-blue-900 to-indigo-900 border-t border-blue-800'
                    }`}
            >
                {/* Megamenu content */}
                {renderContent()}

                {/* Footer with links and CTA */}
                {renderFooter()}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full ${isScrolled
                            ? 'text-gray-500 hover:bg-gray-100'
                            : 'text-gray-300 hover:bg-blue-800'
                        }`}
                    aria-label="Sluit menu"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default MegaMenu;