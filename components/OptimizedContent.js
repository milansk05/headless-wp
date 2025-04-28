import { useEffect, useRef, useState } from 'react';
import OptiImage from './OptiImage';
import ImageGallery from './ImageGallery';
import { validateImageSrc } from '../utils/imageUtils';

/**
 * OptimizedContent - Component dat WordPress content rendert met geoptimaliseerde afbeeldingen
 * 
 * @component
 * @param {Object} props
 * @param {string} props.content - WordPress HTML content
 * @param {string} props.className - Extra CSS klassen
 * @param {Function} props.onContentParsed - Callback wanneer content geparseerd is
 */
const OptimizedContent = ({
    content,
    className = '',
    onContentParsed = null,
}) => {
    const contentRef = useRef(null);
    const [optimizedContent, setOptimizedContent] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);

    // Optimaliseer afbeeldingen in de WordPress content
    useEffect(() => {
        if (!content) {
            setOptimizedContent('');
            return;
        }

        // Functie om content te parsen en afbeeldingen te optimaliseren
        const optimizeContentImages = () => {
            // Maak een tijdelijk element om de HTML te parsen
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;

            // Zoek alle afbeeldingen
            const images = tempDiv.querySelectorAll('img');

            // Zoek alle WordPress galerijen
            const galleries = tempDiv.querySelectorAll('.wp-block-gallery, .blocks-gallery-grid');

            // Verzamel alle galerij-afbeeldingen
            const foundGalleryImages = [];

            // Optimaliseer WordPress galerijen
            galleries.forEach((gallery, galleryIndex) => {
                // Verzamel alle afbeeldingen in deze galerij
                const galleryItems = gallery.querySelectorAll('figure, .blocks-gallery-item');
                const galleryImagesArray = [];

                galleryItems.forEach((item) => {
                    const img = item.querySelector('img');
                    const caption = item.querySelector('figcaption');

                    if (img) {
                        // Voeg afbeelding toe aan array
                        galleryImagesArray.push({
                            src: img.src,
                            alt: img.alt || '',
                            width: img.getAttribute('width') || 800,
                            height: img.getAttribute('height') || 600,
                            caption: caption ? caption.innerHTML : null,
                        });
                    }
                });

                // Als we afbeeldingen hebben gevonden, vervang de galerij door een placeholder
                if (galleryImagesArray.length > 0) {
                    foundGalleryImages.push({
                        id: `gallery-${galleryIndex}`,
                        images: galleryImagesArray,
                        columns: gallery.classList.contains('columns-1') ? 1 :
                            gallery.classList.contains('columns-2') ? 2 :
                                gallery.classList.contains('columns-3') ? 3 :
                                    gallery.classList.contains('columns-4') ? 4 : 3
                    });

                    // Vervang galerij door placeholder
                    const placeholder = document.createElement('div');
                    placeholder.className = 'optimized-gallery-placeholder';
                    placeholder.setAttribute('data-gallery-id', `gallery-${galleryIndex}`);
                    gallery.parentNode.replaceChild(placeholder, gallery);
                }
            });

            // Update state met gevonden galerijen
            setGalleryImages(foundGalleryImages);

            // Optimaliseer individuele afbeeldingen
            images.forEach((img) => {
                // Skip afbeeldingen in galerijen (deze worden apart verwerkt)
                if (img.closest('.wp-block-gallery, .blocks-gallery-grid')) {
                    return;
                }

                // Haal attributen op
                const src = img.src;
                const alt = img.alt || '';
                const width = img.getAttribute('width');
                const height = img.getAttribute('height');
                const figcaption = img.closest('figure')?.querySelector('figcaption')?.innerHTML;

                // Vervang afbeelding door placeholder
                const placeholder = document.createElement('span');
                placeholder.className = 'optimized-image-placeholder';
                placeholder.setAttribute('data-src', src);
                placeholder.setAttribute('data-alt', alt);
                if (width) placeholder.setAttribute('data-width', width);
                if (height) placeholder.setAttribute('data-height', height);
                if (figcaption) placeholder.setAttribute('data-caption', figcaption);

                // Vervang img door placeholder
                if (img.parentNode) {
                    img.parentNode.replaceChild(placeholder, img);
                }
            });

            // Update geoptimaliseerde content
            setOptimizedContent(tempDiv.innerHTML);
        };

        optimizeContentImages();
    }, [content]);

    // Vervang placeholders door echte componenten na rendering
    useEffect(() => {
        if (!contentRef.current || !optimizedContent) return;

        // Vervang afbeelding-placeholders door OptiImage componenten
        const replacePlaceholders = () => {
            // Vind alle image placeholders
            const imagePlaceholders = contentRef.current.querySelectorAll('.optimized-image-placeholder');

            // Vervang elke placeholder
            imagePlaceholders.forEach((placeholder) => {
                // Haal attributen op
                const src = placeholder.getAttribute('data-src');
                const alt = placeholder.getAttribute('data-alt') || '';
                const width = placeholder.getAttribute('data-width') || 800;
                const height = placeholder.getAttribute('data-height') || 600;
                const caption = placeholder.getAttribute('data-caption');

                // Valideer afbeeldings-URL
                const validatedSrc = validateImageSrc(src);

                // Maak container
                const container = document.createElement('div');
                container.className = 'optimized-image-container';

                // Render afbeelding (handmatig DOM manipulatie, alternatief voor React in deze situatie)
                const imgElement = document.createElement('img');
                imgElement.src = validatedSrc;
                imgElement.alt = alt;
                imgElement.style.maxWidth = '100%';
                imgElement.style.height = 'auto';
                imgElement.loading = 'lazy';
                imgElement.setAttribute('width', width);
                imgElement.setAttribute('height', height);

                // Voeg afbeelding toe aan container
                container.appendChild(imgElement);

                // Voeg caption toe indien aanwezig
                if (caption) {
                    const captionElement = document.createElement('figcaption');
                    captionElement.className = 'wp-element-caption';
                    captionElement.innerHTML = caption;
                    container.appendChild(captionElement);
                }

                // Vervang placeholder door container
                placeholder.parentNode.replaceChild(container, placeholder);
            });

            // Vervang galerij-placeholders door ImageGallery componenten
            galleryImages.forEach((gallery) => {
                const placeholder = contentRef.current.querySelector(`[data-gallery-id="${gallery.id}"]`);
                if (placeholder) {
                    // We kunnen geen React componenten direct toevoegen, dus hier tonen we een bericht
                    // met instructies voor de site-eigenaar
                    const galleryContainer = document.createElement('div');
                    galleryContainer.className = 'wp-block-gallery optimized-gallery';

                    // Voeg bericht toe met instructies
                    const message = document.createElement('p');
                    message.className = 'gallery-message';
                    message.textContent = `Galerij met ${gallery.images.length} afbeeldingen`;
                    galleryContainer.appendChild(message);

                    // Voeg basic grid toe met afbeeldingen
                    const grid = document.createElement('div');
                    grid.className = 'gallery-grid grid';
                    grid.style.display = 'grid';
                    grid.style.gridTemplateColumns = `repeat(${gallery.columns}, 1fr)`;
                    grid.style.gap = '1rem';

                    // Voeg afbeeldingen toe aan grid
                    gallery.images.forEach((image) => {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'gallery-item';

                        const img = document.createElement('img');
                        img.src = validateImageSrc(image.src);
                        img.alt = image.alt || '';
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        img.loading = 'lazy';

                        imgContainer.appendChild(img);

                        if (image.caption) {
                            const caption = document.createElement('figcaption');
                            caption.className = 'wp-element-caption';
                            caption.innerHTML = image.caption;
                            imgContainer.appendChild(caption);
                        }

                        grid.appendChild(imgContainer);
                    });

                    galleryContainer.appendChild(grid);

                    // Vervang placeholder door galerij
                    placeholder.parentNode.replaceChild(galleryContainer, placeholder);
                }
            });

            // Call onContentParsed callback met het verwerkte element
            if (onContentParsed && typeof onContentParsed === 'function') {
                onContentParsed(contentRef.current);
            }
        };

        // Vervang placeholders na korte timeout om te zorgen dat de DOM volledig gerenderd is
        const timer = setTimeout(replacePlaceholders, 0);
        return () => clearTimeout(timer);
    }, [optimizedContent, galleryImages, onContentParsed]);

    return (
        <div
            ref={contentRef}
            className={`wordpress-content ${className}`}
            dangerouslySetInnerHTML={{ __html: optimizedContent }}
        />
    );
};

export default OptimizedContent;