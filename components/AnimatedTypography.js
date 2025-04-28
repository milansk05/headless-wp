import React from 'react';
import Typography from './Typography';
import useInView from '../hooks/useInView';

/**
 * Geanimeerde typografie component die animeert wanneer het in beeld komt
 * 
 * @param {Object} props - Component eigenschappen
 * @param {string} props.animation - Type animatie ('fade', 'slide-up', 'slide-left', 'slide-right', 'scale')
 * @param {number} props.delay - Vertraging in milliseconden voordat de animatie start
 * @param {number} props.duration - Duur van de animatie in milliseconden
 * @param {number} props.distance - Afstand voor slide animaties in pixels
 * @param {string} props.easing - Timing functie voor de animatie (CSS easing)
 * @param {boolean} props.once - Animatie slecht eenmaal triggeren
 * @param {string} props.className - Extra CSS classes
 * @param {string} props.variant - Typography variant
 */
const AnimatedTypography = ({
    animation = 'fade',
    delay = 0,
    duration = 600,
    distance = 30,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    once = true,
    threshold = 0.2,
    className = '',
    variant = 'p',
    children,
    ...rest
}) => {
    // Gebruik de inView hook om te detecteren wanneer het element zichtbaar wordt
    const [ref, inView] = useInView({
        threshold,
        triggerOnce: once,
        rootMargin: '0px 0px -10% 0px', // Trigger iets eerder dan wanneer het precies in de viewport is
    });

    // Definieer de animatie-stijlen op basis van de gekozen animatie
    const getAnimationStyles = () => {
        // Basisstijlen die voor elke animatie gelden
        const baseStyles = {
            opacity: inView ? 1 : 0,
            transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
        };

        // Specifieke transformatie op basis van het animatietype
        switch (animation) {
            case 'slide-up':
                return {
                    ...baseStyles,
                    transform: inView ? 'translateY(0)' : `translateY(${distance}px)`,
                };
            case 'slide-left':
                return {
                    ...baseStyles,
                    transform: inView ? 'translateX(0)' : `translateX(${distance}px)`,
                };
            case 'slide-right':
                return {
                    ...baseStyles,
                    transform: inView ? 'translateX(0)' : `translateX(-${distance}px)`,
                };
            case 'scale':
                return {
                    ...baseStyles,
                    transform: inView ? 'scale(1)' : 'scale(0.95)',
                };
            case 'fade':
            default:
                return baseStyles;
        }
    };

    // Combineer stijlen met inline React styles
    const animationStyles = getAnimationStyles();

    return (
        <div ref={ref} style={animationStyles}>
            <Typography
                variant={variant}
                className={className}
                {...rest}
            >
                {children}
            </Typography>
        </div>
    );
};

export default AnimatedTypography;