import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Component dat verwante secties voor een bepaalde heading weergeeft
 * 
 * @param {Object} props Component properties
 * @param {string} props.content HTML content van het artikel
 * @param {string} props.currentId ID van de huidige heading
 * @param {Array} props.headingSelector Array van heading types om te includeren (default: h2, h3)
 * @param {number} props.maxRelated Maximum aantal verwante secties om te tonen (default: 3)
 */
const RelatedSections = ({
    content,
    currentId,
    headingSelector = ['h2', 'h3'],
    maxRelated = 3
}) => {
    const [relatedSections, setRelatedSections] = useState([]);

    useEffect(() => {
        if (!content || !currentId) return;

        // Parse het HTML-document om alle headings te vinden
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
                    level,
                    // Haal de paragraaf tekst op volgend op deze heading (voor context)
                    context: getContextAfterHeading(heading)
                });
            });

            // Vind gerelateerde secties op basis van tekst en context overeenkomsten
            findRelatedSections(headings);
        };

        // Functie om wat context na de heading te krijgen (voor betere overeenkomsten)
        const getContextAfterHeading = (heading) => {
            let context = '';
            let currentNode = heading.nextElementSibling;

            // Verzamel de eerste paar paragrafen na de heading
            let paragraphCount = 0;
            while (currentNode && paragraphCount < 2) {
                if (currentNode.tagName === 'P') {
                    context += ' ' + currentNode.textContent;
                    paragraphCount++;
                }
                currentNode = currentNode.nextElementSibling;
            }

            return context;
        };

        // Functie om gerelateerde secties te vinden
        const findRelatedSections = (headings) => {
            // Vind de huidige sectie
            const currentSection = headings.find(h => h.id === currentId);

            if (!currentSection) return;

            // Eenvoudig algoritme voor het vinden van gerelateerde secties op basis van tekst overeenkomsten
            const related = headings
                .filter(h => h.id !== currentId) // Filter de huidige sectie uit
                .map(heading => {
                    // Bereken een eenvoudige relevantie score op basis van gedeelde woorden
                    const score = calculateRelevanceScore(currentSection, heading);
                    return { ...heading, score };
                })
                .sort((a, b) => b.score - a.score) // Sorteer op relevantie score
                .slice(0, maxRelated); // Beperk tot het maximale aantal

            setRelatedSections(related);
        };

        // Functie om een eenvoudige relevantie score te berekenen
        const calculateRelevanceScore = (currentSection, otherSection) => {
            // Combineer de heading tekst met de context voor een betere match
            const currentText = (currentSection.text + ' ' + currentSection.context).toLowerCase();
            const otherText = (otherSection.text + ' ' + otherSection.context).toLowerCase();

            // Splits op woorden en filter stopwoorden
            const currentWords = currentText.split(/\s+/).filter(word => word.length > 3);
            const otherWords = otherText.split(/\s+/).filter(word => word.length > 3);

            // Tel hoeveel woorden overeenkomen
            let matchCount = 0;
            for (const word of currentWords) {
                if (otherWords.includes(word)) {
                    matchCount++;
                }
            }

            // Basis score op basis van overeenkomstige woorden
            let score = matchCount / Math.max(currentWords.length, 1);

            // Bonus voor secties met hetzelfde niveau
            if (currentSection.level === otherSection.level) {
                score += 0.2;
            }

            return score;
        };

        parseContent();
    }, [content, currentId, headingSelector, maxRelated]);

    // Als er geen verwante secties zijn, of als er geen huidige sectie is, geef niets weer
    if (relatedSections.length === 0 || !currentId) {
        return null;
    }

    return (
        <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Verwante secties</h4>
            <ul className="space-y-1">
                {relatedSections.map((section) => (
                    <li key={section.id}>
                        <Link
                            href={`#${section.id}`}
                            className="text-blue-600 hover:underline text-sm block py-1"
                        >
                            {section.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RelatedSections;