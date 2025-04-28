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
 * @param {string} props.imageSize - Grootte van de afbeelding ('thumbnail', 'medium', 'large', 'full')
 * @param {boolean} props.priority - Of de afbeelding prioriteit heeft voor LCP
 * @param {boolean} props.isHero - Of dit een hero afbeelding is
 */
const FeaturedImage = ({
    featuredImage,
    postTitle = '',
    className = '',
    linkToPost = false,
    postSlug = '',
    imageSize = 'large',
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

    return (
        <div
            className={`featured-image overflow-hidden ${className}`}
            style={{
                position: 'relative',
                width: '100%',
                height: props.height || undefined,
                // Als er geen specifieke hoogte is, gebruik aspectratio om de hoogte te berekenen
                paddingTop: !props.height ? `${(1 / aspectRatio) * 100}%` : undefined
            }}
        >
            <OptiImage
                src={validatedSrc}
                alt={effectiveAlt}
                width={originalWidth || 1200}
                height={originalHeight || Math.round(1200 / aspectRatio)}
                layout="fill"
                objectFit={props.objectFit || "cover"}
                priority={isLCP}
                quality={props.quality || 85}
                sizes={imageSizes}
                linkTo={linkUrl}
                onLoad={() => setImageLoaded(true)}
                className={`transition-all duration-700 ${imageLoaded ? 'scale-100' : 'scale-105'}`}
                {...props}
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