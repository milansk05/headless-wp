/**
 * Utilities voor afbeeldingsoptimalisatie
 */

/**
 * Genereert een optimale 'sizes' attribuut string op basis van de afbeeldingscontainer
 * 
 * @param {Object} options - Configuratie opties
 * @param {string} options.containerClass - CSS klasse van de container (bijv. 'container', 'col-6')
 * @param {boolean} options.isFullWidth - Of de afbeelding de volledige breedte gebruikt
 * @param {Object} options.breakpoints - Aangepaste breakpoints
 * @returns {string} 'sizes' attribuut string
 */
export const generateSizes = ({
    containerClass = '',
    isFullWidth = false,
    breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
    }
}) => {
    if (isFullWidth) {
        return '100vw';
    }

    // Default container widths als percentage van viewport
    const containerWidths = {
        'container': {
            xs: 100,
            sm: 100,
            md: 90, // 90% van viewport op medium screens
            lg: 90,
            xl: 1280 // max-width op xl en groter
        },
        'col-12': { xs: 100, sm: 100, md: 100, lg: 100, xl: 100 },
        'col-6': { xs: 100, sm: 100, md: 50, lg: 50, xl: 50 },
        'col-4': { xs: 100, sm: 50, md: 33.33, lg: 33.33, xl: 33.33 },
        'col-3': { xs: 50, sm: 50, md: 25, lg: 25, xl: 25 },
    };

    // Bepaal container breedte op basis van klasse
    let widths = containerWidths['container']; // default

    if (containerClass && containerWidths[containerClass]) {
        widths = containerWidths[containerClass];
    }

    // Bouw sizes string
    const sizesArray = [
        `(max-width: ${breakpoints.sm}px) ${widths.xs}vw`,
        `(max-width: ${breakpoints.md}px) ${widths.sm}vw`,
        `(max-width: ${breakpoints.lg}px) ${widths.md}vw`,
        `(max-width: ${breakpoints.xl}px) ${widths.lg}vw`,
    ];

    // Voor de grootste maat, gebruik vw voor percentage of px voor vaste width
    if (typeof widths.xl === 'number' && widths.xl < 100) {
        sizesArray.push(`${widths.xl}vw`);
    } else if (typeof widths.xl === 'number') {
        sizesArray.push(`${widths.xl}px`);
    } else {
        sizesArray.push('100vw');
    }

    return sizesArray.join(', ');
};

/**
 * Berekent optimale afbeeldingsafmetingen op basis van container en apparaat
 * 
 * @param {Object} options - Configuratie opties
 * @param {number} options.originalWidth - Originele afbeeldingsbreedte
 * @param {number} options.originalHeight - Originele afbeeldingshoogte
 * @param {string} options.containerClass - CSS klasse van de container
 * @param {number} options.maxWidth - Maximale breedte om te genereren
 * @param {number} options.devicePixelRatio - Apparaat pixelratio voor retina displays
 * @returns {Object} Berekende optimale breedte en hoogte
 */
export const calculateImageDimensions = ({
    originalWidth,
    originalHeight,
    containerClass = 'container',
    maxWidth = 1920,
    devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
}) => {
    // Als originele afmetingen niet beschikbaar zijn, return null
    if (!originalWidth || !originalHeight) {
        return { width: null, height: null };
    }

    // Bereken de aspect ratio
    const aspectRatio = originalWidth / originalHeight;

    // Bepaal container breedte op basis van klasse
    let containerWidth;

    switch (containerClass) {
        case 'col-6':
            containerWidth = Math.min(maxWidth / 2, originalWidth);
            break;
        case 'col-4':
            containerWidth = Math.min(maxWidth / 3, originalWidth);
            break;
        case 'col-3':
            containerWidth = Math.min(maxWidth / 4, originalWidth);
            break;
        default:
            containerWidth = Math.min(maxWidth, originalWidth);
    }

    // Pas toe device pixel ratio voor retina schermen
    const optimizedWidth = Math.round(containerWidth * devicePixelRatio);

    // Bereken optimale hoogte met behoud van aspect ratio
    const optimizedHeight = Math.round(optimizedWidth / aspectRatio);

    return {
        width: Math.min(optimizedWidth, originalWidth),
        height: Math.min(optimizedHeight, originalHeight)
    };
};

/**
 * Genereert optimale srcSet voor WordPress afbeeldingen
 * 
 * @param {string} baseUrl - Basis URL van de afbeelding
 * @param {Array} widths - Array van gewenste breedtes
 * @param {number} quality - Afbeeldingskwaliteit (1-100)
 * @returns {string} srcSet attribuut string
 */
export const generateWordPressSrcSet = (baseUrl, widths = [320, 640, 960, 1280, 1920], quality = 80) => {
    if (!baseUrl) return '';

    // Verwijder bestaande parameters als die er zijn
    const cleanUrl = baseUrl.split('?')[0];

    // Genereer srcSet voor WordPress.com en Jetpack gehoste afbeeldingen
    if (baseUrl.includes('wp.com/') || baseUrl.includes('wp-content/uploads/')) {
        return widths
            .map(width => `${cleanUrl}?w=${width}&quality=${quality} ${width}w`)
            .join(', ');
    }

    // Voor andere afbeeldingen, return lege string
    return '';
};

/**
 * Controleert of URL naar een geldige afbeelding wijst en normaliseert deze
 * 
 * @param {string} src - Afbeeldings-URL om te controleren
 * @param {string} fallbackSrc - Fallback URL als src ongeldig is
 * @returns {string} Gevalideerde en genormaliseerde URL
 */
export const validateImageSrc = (src, fallbackSrc = '/images/placeholder.jpg') => {
    // Check voor null, undefined of lege string
    if (!src || src === 'null' || src === 'undefined' || src === '') {
        return fallbackSrc;
    }

    // Verwijder ongeldige karakters
    const cleanSrc = src.trim().replace(/[\\<>]/g, '');

    // Check voor incomplete URLs
    if (cleanSrc.includes('undefined') || cleanSrc.includes('null')) {
        return fallbackSrc;
    }

    // Normaliseer WordPress media URLs
    if (cleanSrc.includes('/wp-content/uploads/')) {
        // Zorg dat we een absolute URL hebben
        if (cleanSrc.startsWith('/')) {
            // Als het een relatieve URL is, voeg de WordPress URL toe
            // Opmerking: in productie moet je hier je WordPress URL configureren
            const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://headless-wp.local';
            return `${wpUrl}${cleanSrc}`;
        }
    }

    return cleanSrc;
};

/**
 * Maak een lage resolutie plaatshouder (blur) van een afbeelding
 * 
 * @param {string} src - Afbeeldings-URL 
 * @param {number} width - Plaatshouder breedte (meestal klein, bijv. 10px)
 * @returns {string} URL voor lage resolutie plaatshouder
 */
export const getLowResPlaceholder = (src, width = 10) => {
    if (!src) return null;

    // Als het een WordPress.com of Jetpack URL is
    if (src.includes('wp.com/')) {
        const baseUrl = src.split('?')[0];
        return `${baseUrl}?w=${width}&filter=blur`;
    }

    // Voor andere afbeeldingen, return null (Next.js zal de standaard placeholder gebruiken)
    return null;
};

/**
 * Bepaalt of een afbeelding een belangrijke LCP (Largest Contentful Paint) kandidaat is
 * Nuttig voor preloading/prioriteit.
 * 
 * @param {Object} options - Configuratie opties
 * @param {boolean} options.isFeatured - Is dit een uitgelichte afbeelding
 * @param {boolean} options.isHero - Is dit een hero afbeelding 
 * @param {boolean} options.isAboveFold - Is afbeelding above the fold
 * @param {number} options.index - Index van de afbeelding op de pagina
 * @returns {boolean} True als het een LCP kandidaat is
 */
export const isLCPCandidate = ({
    isFeatured = false,
    isHero = false,
    isAboveFold = false,
    index = 0
}) => {
    // Als het een hero of featured image is, is het waarschijnlijk LCP
    if (isHero || isFeatured) return true;

    // Eerste afbeelding above the fold is waarschijnlijk LCP
    if (isAboveFold && index === 0) return true;

    return false;
};

export default {
    generateSizes,
    calculateImageDimensions,
    generateWordPressSrcSet,
    validateImageSrc,
    getLowResPlaceholder,
    isLCPCandidate
};