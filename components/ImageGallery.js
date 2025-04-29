import { useState, useCallback } from 'react';
import OptiImage from './OptiImage';
import { validateImageSrc } from '../utils/imageUtils';

/**
 * ImageGallery - Responsive afbeeldingsgalerij component
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.images - Array van afbeeldingsobjecten
 * @param {string} props.className - Extra CSS klassen
 * @param {number} props.columns - Aantal kolommen (1-4)
 * @param {boolean} props.lightbox - Lightbox functionaliteit inschakelen
 * @param {string} props.gap - Gap tussen afbeeldingen (CSS waarde)
 * @param {boolean} props.masonry - Masonry layout inschakelen
 * @param {function} props.onImageClick - Functie die wordt aangeroepen bij klikken op afbeelding
 */
const ImageGallery = ({
    images = [],
    className = '',
    columns = 3,
    lightbox = true,
    gap = '1rem',
    masonry = false,
    onImageClick = null,
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    // Beperk aantal kolommen tot 1-4
    const effectiveColumns = Math.min(Math.max(columns, 1), 4);

    // Functie om de lightbox te openen
    const openLightbox = useCallback((image, index) => {
        if (lightbox) {
            setSelectedImage({ image, index });
        }
        if (onImageClick) {
            onImageClick(image, index);
        }
    }, [lightbox, onImageClick]);

    // Functie om de lightbox te sluiten
    const closeLightbox = () => {
        setSelectedImage(null);
    };

    // Ga naar volgende afbeelding in lightbox
    const nextImage = (e) => {
        e.stopPropagation();
        if (selectedImage && images.length > 0) {
            const nextIndex = (selectedImage.index + 1) % images.length;
            setSelectedImage({
                image: images[nextIndex],
                index: nextIndex
            });
        }
    };

    // Ga naar vorige afbeelding in lightbox
    const prevImage = (e) => {
        e.stopPropagation();
        if (selectedImage && images.length > 0) {
            const prevIndex = (selectedImage.index - 1 + images.length) % images.length;
            setSelectedImage({
                image: images[prevIndex],
                index: prevIndex
            });
        }
    };

    // Als er geen afbeeldingen zijn, render niets
    if (!images || images.length === 0) {
        return null;
    }

    // Grid layout class op basis van aantal kolommen
    const gridClass = `grid-cols-1 sm:grid-cols-${Math.min(effectiveColumns, 2)} md:grid-cols-${effectiveColumns}`;

    // Bepaal of we masonry of standaard grid moeten gebruiken
    const layoutClasses = masonry
        ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'
        : `grid ${gridClass} gap-4`;

    return (
        <div className={`image-gallery ${className}`}>
            {/* Afbeeldingsgalerij */}
            <div
                className={layoutClasses}
                style={{ gap }}
            >
                {images.map((image, index) => {
                    // WordPress afbeeldingsformaat (als beschikbaar) of standaard URL
                    const src = image.sourceUrl || image.src || image;

                    // Valideer en normaliseer afbeeldings-URL
                    const validatedSrc = validateImageSrc(src);

                    // Alt tekst bepalen
                    const alt = image.altText || image.alt || `Afbeelding ${index + 1}`;

                    // Bepaal afmetingen (als beschikbaar)
                    const width = image.mediaDetails?.width || image.width || 800;
                    const height = image.mediaDetails?.height || image.height || 600;

                    // Bereken aspectratio voor consistente layout
                    const aspectRatio = width / height;

                    return masonry ? (
                        // Masonry layout (CSS columns)
                        <div
                            key={`gallery-img-${index}`}
                            className="break-inside-avoid mb-4 cursor-pointer overflow-hidden rounded-lg hover:shadow-lg transition-shadow"
                            onClick={() => openLightbox(image, index)}
                        >
                            <OptiImage
                                src={validatedSrc}
                                alt={alt}
                                width={width}
                                height={height}
                                layout="responsive"
                                className="w-full"
                                objectFit="cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                quality={80}
                            />
                            {image.caption && (
                                <div className="p-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: image.caption }} />
                            )}
                        </div>
                    ) : (
                        // Standaard grid layout
                        <div
                            key={`gallery-img-${index}`}
                            className="overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => openLightbox(image, index)}
                        >
                            <div style={{ position: 'relative', paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
                                <OptiImage
                                    src={validatedSrc}
                                    alt={alt}
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    quality={80}
                                />
                            </div>
                            {image.caption && (
                                <div className="p-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: image.caption }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lightbox */}
            {lightbox && selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                        onClick={closeLightbox}
                        aria-label="Sluiten"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                        onClick={prevImage}
                        aria-label="Vorige afbeelding"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                        onClick={nextImage}
                        aria-label="Volgende afbeelding"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="p-4 max-w-6xl max-h-screen overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <OptiImage
                                src={validateImageSrc(selectedImage.image.sourceUrl || selectedImage.image.src || selectedImage.image)}
                                alt={selectedImage.image.altText || selectedImage.image.alt || `Afbeelding ${selectedImage.index + 1}`}
                                width={selectedImage.image.mediaDetails?.width || selectedImage.image.width || 1200}
                                height={selectedImage.image.mediaDetails?.height || selectedImage.image.height || 800}
                                layout="responsive"
                                quality={90}
                                objectFit="contain"
                                priority={true}
                                className="max-h-[80vh] w-auto mx-auto"
                            />
                        </div>

                        {selectedImage.image.caption && (
                            <div
                                className="text-white mt-4 text-center p-2"
                                dangerouslySetInnerHTML={{ __html: selectedImage.image.caption }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;