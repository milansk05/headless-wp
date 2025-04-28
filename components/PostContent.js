import React, { useState, useEffect, useRef } from 'react';
import OptimizedContent from './OptimizedContent';

/**
 * OptimizedPostContent - Component voor het weergeven van WordPress postinhoud met geoptimaliseerde afbeeldingen
 * 
 * Dit is een aangepaste versie van de PostContent component die OptimizedContent gebruikt voor betere afbeeldingsverwerking.
 * 
 * @param {Object} props Component properties
 * @param {string} props.content HTML content van het bericht
 * @param {function} props.onContentParsed Callback functie die wordt aangeroepen na het parsen van content
 */
const OptimizedPostContent = ({
    content,
    onContentParsed = null
}) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const contentRef = useRef(null);

    // Check of webfonts correct zijn geladen
    useEffect(() => {
        // Controleer of document bestaat (client-side rendering)
        if (typeof document !== 'undefined') {
            // Wacht kort om te zorgen dat de fonts zijn geladen
            const timer = setTimeout(() => {
                setFontLoaded(true);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, []);

    // Voeg IDs toe aan alle h1, h2, h3, h4 elementen voor de inhoudsopgave
    useEffect(() => {
        if (contentRef.current) {
            const addIdsToHeadings = () => {
                const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4');
                headings.forEach((heading, index) => {
                    if (!heading.id) {
                        // Creëer een slug op basis van de heading tekst
                        let slug = heading.textContent
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, '') // Verwijder niet-woord tekens
                            .replace(/[\s_-]+/g, '-') // Vervang whitespace en underscores door hyphens
                            .replace(/^-+|-+$/g, ''); // Verwijder leading/trailing hyphens

                        // Als de slug leeg is of alleen uit getallen bestaat, gebruik een generiek id
                        if (!slug || /^\d+$/.test(slug)) {
                            slug = `section-${index}`;
                        }

                        // Zorg ervoor dat de ID uniek is
                        let uniqueSlug = slug;
                        let counter = 1;
                        while (document.getElementById(uniqueSlug)) {
                            uniqueSlug = `${slug}-${counter}`;
                            counter++;
                        }

                        heading.id = uniqueSlug;
                    }
                });
            };

            addIdsToHeadings();
        }
    }, [content]);

    // Callback voor wanneer de content is geparseerd
    const handleContentParsed = (parsedElement) => {
        // Forwarden naar de onContentParsed prop als die is meegegeven
        if (onContentParsed && typeof onContentParsed === 'function') {
            onContentParsed(parsedElement);
        }
    };

    return (
        <article
            ref={contentRef}
            className={`
                prose prose-lg lg:prose-xl max-w-none
                ${fontLoaded ? 'font-loaded' : 'font-loading'}
                
                /* Headings stijlen */
                prose-headings:font-display
                prose-headings:font-semibold 
                prose-headings:text-gray-900 
                prose-headings:tracking-tight
                prose-headings:scroll-mt-20
                
                /* H1 stijlen */
                prose-h1:text-3xl 
                prose-h1:md:text-4xl
                prose-h1:lg:text-5xl
                prose-h1:mt-0 
                prose-h1:mb-6 
                prose-h1:font-bold
                prose-h1:leading-tight
                
                /* H2 stijlen */
                prose-h2:text-2xl 
                prose-h2:md:text-3xl
                prose-h2:mt-10 
                prose-h2:mb-4 
                prose-h2:pb-2 
                prose-h2:border-b 
                prose-h2:border-gray-200
                
                /* H3 stijlen */
                prose-h3:text-xl 
                prose-h3:md:text-2xl 
                prose-h3:mt-8 
                prose-h3:mb-3
                
                /* Paragraaf stijlen */
                prose-p:my-5 
                prose-p:leading-7
                prose-p:md:leading-relaxed
                
                /* Link stijlen */
                prose-a:text-blue-600 
                prose-a:font-medium
                prose-a:no-underline 
                prose-a:transition-colors
                hover:prose-a:underline 
                hover:prose-a:text-blue-800
                
                /* Blockquote stijlen */
                prose-blockquote:border-l-4 
                prose-blockquote:border-blue-500 
                prose-blockquote:bg-blue-50 
                prose-blockquote:pl-4 
                prose-blockquote:py-2 
                prose-blockquote:font-serif
                prose-blockquote:text-gray-900
                prose-blockquote:relative
                prose-blockquote:rounded-r
                
                /* Code stijlen */
                prose-code:text-purple-600
                prose-code:bg-gray-50
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:rounded
                prose-code:font-mono
                prose-code:text-sm
                prose-code:font-medium
                prose-code:border
                prose-code:border-gray-200
                
                /* Pre stijlen */
                prose-pre:bg-gray-50
                prose-pre:border
                prose-pre:border-gray-200
                prose-pre:rounded-lg
                prose-pre:overflow-x-auto
                
                /* Lijst stijlen */
                prose-ul:my-6
                prose-ul:list-disc
                prose-ol:my-6
                prose-ol:list-decimal
                prose-li:my-2
                prose-li:marker:text-blue-500
                
                /* Tabel stijlen */
                prose-table:w-full
                prose-table:my-8
                prose-thead:bg-gray-50
                prose-th:p-3
                prose-th:font-semibold
                prose-th:text-left
                prose-th:text-sm
                prose-th:text-gray-600
                prose-th:uppercase
                prose-th:tracking-wider
                prose-td:p-3
                prose-td:align-top
                prose-td:border-t
                prose-td:border-gray-200
                
                /* Figuur en afbeelding stijlen */
                prose-figure:my-8
                prose-img:rounded-lg
                prose-img:shadow-md
                
                /* Extra stijlen voor geoptimaliseerde afbeeldingen */
                [&_.optimized-image-container]:my-8
                [&_.optimized-image-container]:rounded-lg
                [&_.optimized-image-container]:overflow-hidden
                [&_.optimized-image-container]:shadow-md
                [&_.optimized-image-container_img]:w-full
                [&_.optimized-image-container_img]:h-auto
                [&_.optimized-image-container_img]:rounded-lg
                [&_.optimized-image-container_figcaption]:text-center
                [&_.optimized-image-container_figcaption]:text-sm
                [&_.optimized-image-container_figcaption]:text-gray-600
                [&_.optimized-image-container_figcaption]:mt-2
                [&_.optimized-image-container_figcaption]:px-4
                
                /* Galerij stijlen */
                [&_.wp-block-gallery]:my-8
                [&_.gallery-grid]:gap-4
                [&_.gallery-item]:rounded-lg
                [&_.gallery-item]:overflow-hidden
                [&_.gallery-item]:shadow-sm
                [&_.gallery-item]:transition-shadow
                [&_.gallery-item:hover]:shadow-md
                [&_.gallery-item_img]:w-full
                [&_.gallery-item_img]:h-auto
                [&_.gallery-item_img]:rounded-lg
                [&_.gallery-item_figcaption]:text-center
                [&_.gallery-item_figcaption]:text-xs
                [&_.gallery-item_figcaption]:text-gray-600
                [&_.gallery-item_figcaption]:mt-1
                [&_.gallery-item_figcaption]:px-2
            `}
        >
            <OptimizedContent
                content={content}
                onContentParsed={handleContentParsed}
            />
        </article>
    );
};

export default OptimizedPostContent;