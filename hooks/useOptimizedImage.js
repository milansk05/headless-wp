import { useState, useEffect, useCallback } from 'react';
import { validateImageSrc, calculateImageDimensions, generateSizes } from '../utils/imageUtils';

/**
 * useOptimizedImage - Custom hook voor het optimaliseren en beheren van afbeeldingsweergave
 * 
 * @param {Object} options - Hook opties
 * @param {string} options.src - Originele afbeeldings-URL
 * @param {string} options.alt - Alt tekst voor de afbeelding
 * @param {number} options.width - Oorspronkelijke breedte (indien bekend)
 * @param {number} options.height - Oorspronkelijke hoogte (indien bekend)
 * @param {string} options.layout - Next.js Image layout ('fill', 'responsive', etc.)
 * @param {boolean} options.priority - Of de afbeelding prioriteit heeft (LCP)
 * @param {string} options.fallbackSrc - Fallback URL als de afbeelding niet kan worden geladen
 * @param {string} options.containerClass - CSS klasse van de container voor responsive berekeningen
 * @returns {Object} - Geoptimaliseerde afbeeldingseigenschappen en statusvariabelen
 */
const useOptimizedImage = ({
    src,
    alt = '',
    width,
    height,
    layout = 'responsive',
    priority = false,
    fallbackSrc = '/images/placeholder.jpg',
    containerClass = 'container',
}) => {
    // Status van de afbeelding
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [optimizedProps, setOptimizedProps] = useState({});

    // Originele afmetingen bijhouden
    const [originalDimensions, setOriginalDimensions] = useState({
        width: width || 0,
        height: height || 0
    });

    // Geoptimaliseerde afbeeldingsbron valideren en instellen
    useEffect(() => {
        if (!src) {
            setError(true);
            setImgSrc(fallbackSrc);
            return;
        }

        // Valideer en normaliseer de afbeeldings-URL
        const validatedSrc = validateImageSrc(src, fallbackSrc);
        setImgSrc(validatedSrc);

        // Reset error status als we een nieuwe src krijgen
        if (validatedSrc !== fallbackSrc) {
            setError(false);
        }

        // Als we in browser zijn en de oorspronkelijke afmetingen niet hebben,
        // probeer dan de afbeeldingsafmetingen te laden
        if (typeof window !== 'undefined' && (!width || !height)) {
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = () => {
                setError(true);
                setImgSrc(fallbackSrc);
            };
            img.src = validatedSrc;
        }
    }, [src, fallbackSrc, width, height]);

    // Bereken optimale afbeeldingsafmetingen op basis van apparaat en container
    useEffect(() => {
        // Alleen berekenen als we originele afmetingen hebben
        if (originalDimensions.width && originalDimensions.height) {
            // Bereken devicePixelRatio voor retina displays
            const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

            // Bereken optimale afmetingen
            const dimensions = calculateImageDimensions({
                originalWidth: originalDimensions.width,
                originalHeight: originalDimensions.height,
                containerClass,
                devicePixelRatio: dpr
            });

            // Genereer sizes attribuut op basis van de container
            const sizes = generateSizes({
                containerClass,
                isFullWidth: containerClass === 'container' || containerClass === 'col-12'
            });

            // Stel geoptimaliseerde props in
            setOptimizedProps({
                width: dimensions.width || originalDimensions.width,
                height: dimensions.height || originalDimensions.height,
                sizes
            });
        }
    }, [originalDimensions, containerClass]);

    // Handle wanneer afbeelding geladen is
    const handleImageLoad = useCallback(() => {
        setLoading(false);
    }, []);

    // Handle wanneer er een fout optreedt bij het laden
    const handleImageError = useCallback(() => {
        setError(true);
        setImgSrc(fallbackSrc);
        setLoading(false);
    }, [fallbackSrc]);

    // Bepaal of deze afbeelding belangrijk is voor LCP
    const isLCPImage = priority || (
        // Als het een afbeelding is in de eerste screenful van de pagina
        typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        document.getElementById('__next') &&
        document.getElementById('__next').offsetHeight <= window.innerHeight
    );

    // Return relevante waarden en functies
    return {
        imgSrc,
        alt,
        loading,
        error,
        handleImageLoad,
        handleImageError,
        isLCPImage,
        originalDimensions,
        ...optimizedProps
    };
};

export default useOptimizedImage;