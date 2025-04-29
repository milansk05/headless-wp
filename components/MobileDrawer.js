import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MobileDrawer - Sliding drawer menu component for mobile devices
 * 
 * @component
 * @param {Object} props Component properties
 * @param {boolean} props.isOpen Whether the drawer is open
 * @param {Function} props.onClose Function to close the drawer
 * @param {React.ReactNode} props.children Content to display in the drawer
 * @param {string} props.position Position of the drawer ('left', 'right', 'bottom', 'top')
 * @param {string} props.className Additional CSS classes
 * @param {string} props.backdropClass CSS classes for the backdrop
 */
const MobileDrawer = ({
    isOpen,
    onClose,
    children,
    position = 'right',
    className = '',
    backdropClass = '',
}) => {
    const drawerRef = useRef(null);

    // Handle clicks outside the drawer to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target) && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent scrolling when drawer is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close on escape key
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

    // Set initial and animate properties based on position
    const getDirectionVariants = () => {
        switch (position) {
            case 'left':
                return {
                    initial: { x: '-100%' },
                    animate: { x: 0 },
                    exit: { x: '-100%' },
                    className: 'top-0 left-0 h-full max-w-xs'
                };
            case 'right':
                return {
                    initial: { x: '100%' },
                    animate: { x: 0 },
                    exit: { x: '100%' },
                    className: 'top-0 right-0 h-full max-w-xs'
                };
            case 'bottom':
                return {
                    initial: { y: '100%' },
                    animate: { y: 0 },
                    exit: { y: '100%' },
                    className: 'bottom-0 left-0 right-0 max-h-[90vh]'
                };
            case 'top':
                return {
                    initial: { y: '-100%' },
                    animate: { y: 0 },
                    exit: { y: '-100%' },
                    className: 'top-0 left-0 right-0 max-h-[90vh]'
                };
            default:
                return {
                    initial: { x: '100%' },
                    animate: { x: 0 },
                    exit: { x: '100%' },
                    className: 'top-0 right-0 h-full max-w-xs'
                };
        }
    };

    const directionProps = getDirectionVariants();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 ${backdropClass}`}
                        onClick={onClose}
                    />

                    {/* Drawer panel */}
                    <motion.div
                        ref={drawerRef}
                        initial={directionProps.initial}
                        animate={directionProps.animate}
                        exit={directionProps.exit}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className={`fixed w-full overflow-auto shadow-lg z-50 bg-white ${directionProps.className} ${className}`}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileDrawer;