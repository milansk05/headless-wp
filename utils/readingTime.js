/**
 * Utility functie om de leestijd van een artikel te berekenen
 * 
 * @param {string} content HTML-content van het artikel
 * @param {number} wordsPerMinute Woorden per minuut leessnelheid (default: 200)
 * @param {boolean} includeImages Of afbeeldingen moeten worden meegeteld in leestijd (default: true)
 * @param {number} imageReadingTime Aantal seconden per afbeelding (default: 12)
 * @returns {Object} Leestijd object met minutes, text en formattedText
 */
export const calculateReadingTime = (
    content,
    wordsPerMinute = 200,
    includeImages = true,
    imageReadingTime = 12
) => {
    if (!content) return { minutes: 0, text: '0 min leestijd', formattedText: 'minder dan 1 minuut leestijd' };

    // Maak een tijdelijk element om de HTML-content te parsen
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Verwijder scripts en styles om alleen de leesbare content te behouden
    const scripts = tempDiv.querySelectorAll('script, style, code, pre');
    scripts.forEach(script => script.remove());

    // Haal de tekst op en tel het aantal woorden
    const text = tempDiv.textContent || '';
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Bereken de basistijd op basis van woorden
    let readingTimeMinutes = wordCount / wordsPerMinute;

    // Tel extra tijd voor afbeeldingen (als deze optie is ingeschakeld)
    if (includeImages) {
        const imageCount = tempDiv.querySelectorAll('img').length;
        readingTimeMinutes += (imageCount * imageReadingTime) / 60;
    }

    // Rond af naar gehele minuten (met een minimum van 1)
    const minutes = Math.max(1, Math.round(readingTimeMinutes));

    // Genereer leesbare tekst
    const readingTimeText = `${minutes} min leestijd`;

    // Genereer uitgebreide leesbare tekst
    let formattedText = '';
    if (minutes < 1) {
        formattedText = 'minder dan 1 minuut leestijd';
    } else if (minutes === 1) {
        formattedText = '1 minuut leestijd';
    } else {
        formattedText = `${minutes} minuten leestijd`;
    }

    return {
        minutes,
        text: readingTimeText,
        formattedText,
        wordCount
    };
};

/**
 * Utility functie om de leestijd met woorden te berekenen
 * 
 * @param {string} content HTML-content van het artikel
 * @returns {string} Leestijd in woorden en minuten
 */
export const formatReadingTime = (content) => {
    const { minutes, wordCount } = calculateReadingTime(content);

    // Formatteer de leestijd
    return `${wordCount.toLocaleString('nl-NL')} woorden · ${minutes} min leestijd`;
};

/**
 * Functie voor server-side leestijdberekening zonder DOM afhankelijkheden
 * Deze functie kan worden gebruikt in getStaticProps/getServerSideProps
 * 
 * @param {string} content HTML-content van het artikel
 * @param {number} wordsPerMinute Woorden per minuut leessnelheid (default: 200)
 * @returns {Object} Leestijd object met minutes en wordCount
 */
export const calculateReadingTimeServer = (content, wordsPerMinute = 200) => {
    if (!content) return { minutes: 0, wordCount: 0 };

    // Verwijder HTML tags en krijg alleen tekst
    const textContent = content.replace(/<[^>]+>/g, ' ');

    // Tel het aantal woorden
    const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Bereken leestijd in minuten
    const minutes = Math.max(1, Math.round(wordCount / wordsPerMinute));

    return {
        minutes,
        wordCount
    };
};

export default {
    calculateReadingTime,
    formatReadingTime,
    calculateReadingTimeServer
};