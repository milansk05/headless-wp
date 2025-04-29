import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * TableOfContents component dat automatisch een inhoudsopgave genereert
 * op basis van de h2, h3, h4 tags in de content.
 * 
 * @param {Object} props Component properties
 * @param {string} props.content HTML content van het artikel
 * @param {boolean} props.enableHighlight Highlight actieve sectie bij scrollen (default: true)
 * @param {Array} props.headingSelector Array van heading types om te includeren (default: h2, h3)
 * @param {boolean} props.smooth Smooth scrolling (default: true)
 * @param {string} props.className Extra CSS classes
 * @param {boolean} props.showRelated Toon gerelateerde secties (default: false)
 * @param {boolean} props.showActions Toon actieknoppen (kopiëren, printen, delen) (default: false)
 */
const TableOfContents = ({
    content,
    enableHighlight = true,
    headingSelector = ['h2', 'h3'],
    smooth = true,
    className = '',
    showRelated = false,
    showActions = false
}) => {
    const [toc, setToc] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const router = useRouter();

    // Parse content om headings te vinden en TOC te genereren
    useEffect(() => {
        if (!content) return;

        // Parse het HTML-document
        const parseContent = () => {
            const div = document.createElement('div');
            div.innerHTML = content;

            const headings = [];
            const allHeadings = div.querySelectorAll(headingSelector.join(', '));

            allHeadings.forEach((heading, index) => {
                // Als er geen ID is, genereer een ID op basis van de tekst
                const id = heading.id || `toc-heading-${index}`;

                // Bepaal het niveau op basis van de heading tag (h2 = 2, h3 = 3, etc.)
                const level = parseInt(heading.tagName[1]);

                headings.push({
                    id,
                    text: heading.textContent,
                    level
                });
            });

            setToc(headings);
        };

        parseContent();
    }, [content, headingSelector]);

    // Voeg IDs toe aan headings in de content als ze nog niet bestaan
    useEffect(() => {
        if (!content || typeof document === 'undefined') return;

        toc.forEach(item => {
            const heading = document.getElementById(item.id);
            if (!heading) {
                const allHeadings = document.querySelectorAll(headingSelector.join(', '));
                allHeadings.forEach((h, index) => {
                    if (!h.id) {
                        h.id = `toc-heading-${index}`;
                    }
                });
            }
        });
    }, [toc, content, headingSelector]);

    // Detecteer actieve sectie tijdens scrollen
    useEffect(() => {
        if (!enableHighlight || toc.length === 0 || typeof document === 'undefined') return;

        const headingElements = toc.map(({ id }) => document.getElementById(id)).filter(Boolean);

        const observerCallback = (entries) => {
            // Vind de eerste heading die in beeld is
            const visibleHeadings = entries.filter(entry => entry.isIntersecting);

            if (visibleHeadings.length > 0) {
                setActiveId(visibleHeadings[0].target.id);
            }
        };

        const observerOptions = {
            root: null, // viewport gebruiken als root
            rootMargin: '-80px 0px -20% 0px', // Trigger iets eerder dan wanneer het precies in de viewport is
            threshold: 0 // Trigger zelfs bij deels zichtbare elementen
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        headingElements.forEach(element => {
            if (element) observer.observe(element);
        });

        return () => {
            headingElements.forEach(element => {
                if (element) observer.unobserve(element);
            });
        };
    }, [toc, enableHighlight]);

    // Handle klikken op een inhoudsopgave-item
    const handleClick = (e, id) => {
        e.preventDefault();

        const element = document.getElementById(id);
        if (!element) return;

        // Scroll naar het element
        const headerOffset = 100; // Offset voor de sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        if (smooth) {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo(0, offsetPosition);
        }

        // Update URL met het fragment
        router.push(`${router.pathname}${router.query ? '?' + new URLSearchParams(router.query).toString() : ''}#${id}`,
            undefined,
            { shallow: true, scroll: false }
        );

        setActiveId(id);
    };

    // Als er geen inhoudsopgave-items zijn, rendereer niets
    if (toc.length === 0) {
        return null;
    }

    return (
        <div className={`bg-gray-50 rounded-lg p-5 mb-6 ${className}`}>
            <h3 className="text-lg font-semibold mb-3">Inhoudsopgave</h3>
            <nav>
                <ul className="space-y-1 text-gray-700">
                    {toc.map((item) => (
                        <li
                            key={item.id}
                            className={`${item.level === 3 ? 'ml-4' : item.level === 4 ? 'ml-8' : ''}`}
                        >
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                className={`block py-1 px-2 rounded transition hover:bg-gray-100 ${activeId === item.id
                                    ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500 pl-3'
                                    : ''
                                    }`}
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Optionele section voor gerelateerde secties - alleen tonen als showRelated=true */}
            {showRelated && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Gerelateerde secties</h4>
                    {/* Hier zou een component kunnen komen die gerelateerde secties toont */}
                    <p className="text-xs text-gray-500">Gerelateerde secties worden automatisch berekend op basis van de inhoud.</p>
                </div>
            )}

            {/* Optionele section voor actieknoppen - alleen tonen als showActions=true */}
            {showActions && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <button className="text-xs text-gray-500 hover:text-blue-600 mr-3" title="Kopieer inhoudsopgave">
                        <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Kopiëren
                    </button>
                    <button className="text-xs text-gray-500 hover:text-blue-600" title="Deel inhoudsopgave">
                        <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Delen
                    </button>
                </div>
            )}
        </div>
    );
};

export default TableOfContents;