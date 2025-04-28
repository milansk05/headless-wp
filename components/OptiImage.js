import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * OptiImage - Geavanceerde afbeeldingscomponent met optimalisaties
 * 
 * @component
 * @param {Object} props
 * @param {string} props.src - Afbeelding URL
 * @param {string} props.alt - Alt tekst voor de afbeelding
 * @param {number|string} props.width - Breedte van de afbeelding (in px of auto)
 * @param {number|string} props.height - Hoogte van de afbeelding (in px of auto)
 * @param {string} props.layout - Layout mode: 'fill', 'fixed', 'intrinsic', 'responsive'
 * @param {string} props.objectFit - CSS object-fit: 'cover', 'contain', 'fill', etc.
 * @param {string} props.className - CSS classes
 * @param {string} props.linkTo - Optionele URL om de afbeelding klikbaar te maken
 * @param {string} props.linkTarget - Target voor de link (_blank, _self, etc.)
 * @param {boolean} props.priority - Prioriteit voor LCP afbeeldingen
 * @param {Object} props.placeholderStyle - Stijl voor de placeholder
 * @param {string} props.fallbackSrc - Fallback afbeelding als de hoofdafbeelding faalt
 * @param {Object} props.sizes - Responsive sizes attribuut
 * @param {boolean} props.lazyBoundary - Aanpasbare lazy boundary marge
 * @param {number} props.quality - Afbeeldingskwaliteit (1-100)
 * @param {function} props.onLoad - Event handler wanneer de afbeelding geladen is
 * @param {function} props.onError - Event handler wanneer het laden mislukt
 */
const OptiImage = ({
    src,
    alt = '',
    width,
    height,
    layout = 'responsive',
    objectFit = 'cover',
    className = '',
    linkTo = null,
    linkTarget = '_self',
    priority = false,
    placeholderStyle = {},
    fallbackSrc = '/images/placeholder.jpg',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    lazyBoundary = '200px',
    quality = 85,
    onLoad = () => { },
    onError = () => { },
    ...rest
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(!priority);
    const [isError, setIsError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    // Reset states wanneer src verandert
    useEffect(() => {
        setImgSrc(src);
        setIsError(false);
        setImgLoaded(false);
        setIsLoading(!priority);
    }, [src, priority]);

    // Handle missing WordPress images of empty srcs
    useEffect(() => {
        if (!src || src === 'null' || src === 'undefined' || src.includes('undefined')) {
            setImgSrc(fallbackSrc);
            setIsError(true);
        }
    }, [src, fallbackSrc]);

    // Bepaal of src wijst naar een geldige WordPress media URL
    const isWordPressUrl = (url) => {
        if (!url) return false;
        return url.includes('/wp-content/uploads/') ||
            url.includes('wp.com/') ||
            url.includes('gravatar.com/');
    };

    // Handle image load event
    const handleImageLoad = (e) => {
        setIsLoading(false);
        setImgLoaded(true);
        onLoad(e);
    };

    // Handle image error event
    const handleImageError = () => {
        console.warn(`Failed to load image: ${src}`);
        setImgSrc(fallbackSrc);
        setIsError(true);
        setIsLoading(false);
        onError();
    };

    // Bereken effectieve afbeeldingsadres (met eventuele WordPress optimalisaties)
    let effectiveSrc = imgSrc;

    // Optimaliseer WordPress afbeeldingen door automatisch de juiste afmetingen te gebruiken
    if (isWordPressUrl(imgSrc) && !isError) {
        // Als we een WordPress URL hebben, kunnen we URL parameters toevoegen voor resize
        // Verwijder bestaande parameters als die er zijn
        const baseUrl = imgSrc.split('?')[0];

        // Voeg resize parameters toe voor WordPress.com en Jetpack gehoste afbeeldingen
        if (imgSrc.includes('wp.com/')) {
            // WordPress.com en Jetpack gebruiken ?w= en ?h= parameters
            const sizeParams = [];

            if (width && width !== 'auto' && !isNaN(parseInt(width))) {
                sizeParams.push(`w=${parseInt(width)}`);
            }

            if (height && height !== 'auto' && !isNaN(parseInt(height))) {
                sizeParams.push(`h=${parseInt(height)}`);
            }

            // Voeg quality parameter toe
            sizeParams.push(`quality=${quality}`);

            // Voeg parameters toe aan URL
            effectiveSrc = `${baseUrl}?${sizeParams.join('&')}`;
        }
    }

    // Bepaal placeholder stijl tijdens het laden
    const placeholder = (
        <div
            className={`bg-gray-200 animate-pulse ${className}`}
            style={{
                width: width !== 'auto' ? width : '100%',
                height: height !== 'auto' ? height : '100%',
                ...placeholderStyle
            }}
            aria-hidden="true"
        />
    );

    // Bepaal de uiteindelijke afbeeldingscomponent
    const imageComponent = (
        <div
            className={`relative transition-opacity duration-500 ${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{
                width: width !== 'auto' ? width : '100%',
                height: height !== 'auto' ? height : '100%',
            }}
        >
            {isLoading && placeholder}

            <Image
                src={effectiveSrc}
                alt={alt}
                width={width !== 'auto' ? parseInt(width) : undefined}
                height={height !== 'auto' ? parseInt(height) : undefined}
                layout={width === 'auto' || height === 'auto' ? 'responsive' : layout}
                objectFit={objectFit}
                quality={quality}
                sizes={sizes}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                lazyBoundary={lazyBoundary}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                style={{
                    objectFit,
                    // Als we een fill layout hebben, vullen we de container
                    ...(layout === 'fill' ? { position: 'absolute', width: '100%', height: '100%' } : {})
                }}
                {...rest}
            />

            {/* Laat error icon/message zien als laden mislukt en fallback ook niet werkt */}
            {isError && fallbackSrc === imgSrc && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )}
        </div>
    );

    // Als een link is opgegeven, maak de afbeelding klikbaar
    if (linkTo) {
        return (
            <Link href={linkTo} target={linkTarget}>
                <a className="block">
                    {imageComponent}
                </a>
            </Link>
        );
    }

    // Anders gewoon de afbeelding returnen
    return imageComponent;
};

export default OptiImage;