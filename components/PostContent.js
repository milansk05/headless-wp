import React, { useState, useEffect } from 'react';

const PostContent = ({ content }) => {
    const [fontLoaded, setFontLoaded] = useState(false);

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

    return (
        <article
            className={`
                prose prose-lg lg:prose-xl max-w-none
                ${fontLoaded ? 'font-loaded' : 'font-loading'}
                
                /* Headings stijlen */
                prose-headings:font-display
                prose-headings:font-semibold 
                prose-headings:text-gray-900 
                prose-headings:tracking-tight
                prose-headings:scroll-m-20
                
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
            `}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default PostContent;