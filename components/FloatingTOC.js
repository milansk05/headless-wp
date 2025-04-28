import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * FloatingTOC component dat een zwevende inhoudsopgave weergeeft tijdens het scrollen
 * 
 * @param {Object} props Component properties
 * @param {string} props.content HTML content van het artikel
 * @param {Array} props.headingSelector Array van heading types om te includeren (default: h2, h3)
 * @param {string} props.position Positie van de zwevende TOC (left, right) (default: right)
 */
const FloatingTOC = ({
    content,
    headingSelector = ['h2', 'h3'],
    position = 'right'
}) => {
    const [toc, setToc] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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

    // Voeg scroll event toe om activeId bij te werken en te bepalen of de FloatingTOC zichtbaar moet zijn
    useEffect(() => {
        if (toc.length === 0 || typeof document === 'undefined') return;

        const handleScroll = () => {
            // Maak de FloatingTOC zichtbaar als de gebruiker meer dan 500px heeft gescrolld
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setIsOpen(false); // Sluit ook de TOC als deze niet zichtbaar is
            }

            // Bepaal de actieve heading
            const headingElements = toc.map(({ id }) => document.getElementById(id)).filter(Boolean);

            // Vind de heading die momenteel in beeld is
            const currentPosition = window.scrollY + 150; // 150px offset voor betere UX

            // Zet een standaard activeId op de eerste heading als er geen in zicht is
            let currentHeading = headingElements[0];

            for (const heading of headingElements) {
                if (heading.offsetTop <= currentPosition) {
                    currentHeading = heading;
                } else {
                    break;
                }
            }

            if (currentHeading) {
                setActiveId(currentHeading.id);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Voer de functie één keer uit bij initialisatie
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [toc]);

    // Handle klikken op een inhoudsopgave-item
    const handleClick = (e, id) => {
        e.preventDefault();

        const element = document.getElementById(id);
        if (!element) return;

        // Scroll naar het element
        const headerOffset = 100; // Offset voor de sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Update URL met het fragment
        router.push(`${router.pathname}${router.query ? '?' + new URLSearchParams(router.query).toString() : ''}#${id}`,
            undefined,
            { shallow: true, scroll: false }
        );

        setActiveId(id);

        // Sluit de TOC op mobiele apparaten na het klikken
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    // Als er geen inhoudsopgave-items zijn, rendereer niets
    if (toc.length === 0) {
        return null;
    }

    // Positionering op basis van de position prop
    const positionClasses = position === 'left'
        ? 'left-4 md:left-8'
        : 'right-4 md:right-8';

    return (
        <div className={`fixed bottom-24 ${positionClasses} z-40 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
            }`}>
            <div className="flex flex-col items-end">
                {/* TOC Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-12 h-12 mb-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-blue-50 focus:outline-none transition"
                    aria-label={isOpen ? "Sluit inhoudsopgave" : "Open inhoudsopgave"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </button>

                {/* TOC Panel */}
                <div className={`bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-80 w-64 opacity-100' : 'max-h-0 w-0 opacity-0'
                    }`}>
                    <div className="p-4 overflow-y-auto max-h-64">
                        <h3 className="text-sm font-semibold mb-2 text-gray-700">In dit artikel</h3>
                        <nav>
                            <ul className="space-y-1 text-sm">
                                {toc.map((item) => (
                                    <li
                                        key={item.id}
                                        className={`${item.level === 3 ? 'ml-3' : item.level === 4 ? 'ml-6' : ''}`}
                                    >
                                        <a
                                            href={`#${item.id}`}
                                            onClick={(e) => handleClick(e, item.id)}
                                            className={`block py-1 px-2 rounded transition hover:bg-gray-100 text-sm truncate ${activeId === item.id
                                                    ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-500 pl-2'
                                                    : 'text-gray-600'
                                                }`}
                                        >
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloatingTOC;