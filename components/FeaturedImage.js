import { useState } from 'react';
import OptiImage from './OptiImage';
import PlaceholderImage from './PlaceholderImage';
import { validateImageSrc, isLCPCandidate, generateSizes } from '../utils/imageUtils';

/**
 * FeaturedImage - Geoptimaliseerde component voor WordPress featured images
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.featuredImage - WordPress featuredImage object
 * @param {string} props.postTitle - Titel van het bericht voor alt tekst
 * @param {string} props.className - Extra CSS klassen
 * @param {boolean} props.linkToPost - Of de afbeelding moet linken naar het bericht
 * @param {string} props.postSlug - Slug van het bericht voor link URL
 * @param {boolean} props.priority - Of de afbeelding prioriteit heeft voor LCP
 * @param {boolean} props.isHero - Of dit een hero afbeelding is
 */
const FeaturedImage = ({
    featuredImage,
    postTitle = '',
    className = '',
    linkToPost = false,
    postSlug = '',
    priority = false,
    isHero = false,
    ...props
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Bepaal of er een geldige afbeelding is
    const hasValidImage = featuredImage && featuredImage.node && featuredImage.node.sourceUrl;

    // Als er geen afbeelding is, toon een placeholder
    if (!hasValidImage) {
        return (
            <PlaceholderImage
                width="100%"
                height={props.height || 400}
                text="Geen afbeelding"
                className={className}
            />
        );
    }

    // Haal informatie uit featuredImage object
    const {
        sourceUrl,
        altText,
        caption,
        mediaDetails
    } = featuredImage.node;

    // Valideer en normaliseer de afbeeldings-URL
    const validatedSrc = validateImageSrc(sourceUrl);

    // Gebruik de titel van het bericht als er geen alt tekst is
    const effectiveAlt = altText || postTitle || 'Featured image';

    // Bepaal of dit een LCP kandidaat is
    const isLCP = priority || isLCPCandidate({
        isFeatured: true,
        isHero,
        isAboveFold: true
    });

    // Haal originele afmetingen op als die beschikbaar zijn
    const originalWidth = mediaDetails?.width;
    const originalHeight = mediaDetails?.height;

    // Bereken de aspectratio voor responsieve afbeeldingen
    const aspectRatio = originalWidth && originalHeight
        ? originalWidth / originalHeight
        : 16 / 9; // standaard 16:9 als er geen afmetingen beschikbaar zijn

    // Genereer optimale sizes attribuut
    const imageSizes = generateSizes({
        containerClass: props.containerClass || (isHero ? 'container' : 'col-12'),
        isFullWidth: isHero
    });

    // Stel de link URL in als de afbeelding moet linken naar het bericht
    const linkUrl = linkToPost && postSlug ? `/posts/${postSlug}` : null;

    // De container moet relative positioning hebben voor de fill layout
    const containerStyle = {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    };

    // Als er geen specifieke className wordt meegegeven die de hoogte regelt, 
    // zorg dan dat we een minimale hoogte hebben op basis van de aspectratio
    if (!className.includes('h-') && !props.style?.height) {
        containerStyle.paddingTop = `${(1 / aspectRatio) * 100}%`;
    }

    // We zorgen dat we geen resterende height/width props doorgeven aan OptiImage
    // omdat we layout="fill" gebruiken
    const { height, width, style, ...restProps } = props;

    return (
        <div
            className={`featured-image ${className}`}
            style={containerStyle}
        >
            <OptiImage
                src={validatedSrc}
                alt={effectiveAlt}
                layout="fill"
                objectFit={props.objectFit || "cover"}
                priority={isLCP}
                quality={props.quality || 85}
                sizes={imageSizes}
                linkTo={linkUrl}
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full"
                style={{
                    opacity: 1, // Expliciete opacity zorgt ervoor dat er geen CSS overschrijvingen zijn
                    transition: 'transform 0.5s ease-out',
                    transform: imageLoaded ? 'scale(1)' : 'scale(1.05)'
                }}
                {...restProps}
            />

            {/* Toon caption als die beschikbaar is */}
            {caption && (
                <div
                    className="caption absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: caption }}
                />
            )}
        </div>
    );
};

export default FeaturedImage;