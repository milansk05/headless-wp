/**
 * Utilities voor het genereren van blur-effecten en placeholders voor afbeeldingen
 */

/**
 * Genereert een css filter string voor een blurry effect
 * 
 * @param {number} blurAmount - Hoeveelheid blur (0-20)
 * @param {number} brightness - Helderheid (0-200, 100 is normaal)
 * @param {number} saturation - Saturatie (0-200, 100 is normaal)
 * @returns {string} - CSS filter string
 */
export const getBlurFilter = (blurAmount = 10, brightness = 100, saturation = 100) => {
    return `blur(${blurAmount}px) brightness(${brightness}%) saturate(${saturation}%)`;
};

/**
 * Genereert een DataURL voor een simpele kleurblok als placeholder
 * 
 * @param {string} color - CSS kleurwaarde (hex, rgb, etc)
 * @param {number} width - Breedte in pixels
 * @param {number} height - Hoogte in pixels
 * @returns {string} - Data URL voor de placeholder
 */
export const getColorPlaceholder = (color = '#F3F4F6', width = 100, height = 100) => {
    // Valideer waarden
    const safeColor = color.match(/^#[0-9A-Fa-f]{6}$/) ? color : '#F3F4F6';
    const safeWidth = Math.max(1, Math.min(1000, width));
    const safeHeight = Math.max(1, Math.min(1000, height));

    // Maak een eenvoudige SVG met de gekozen kleur
    const svg = `
      <svg width="${safeWidth}" height="${safeHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${safeWidth}" height="${safeHeight}" fill="${safeColor}" />
      </svg>
    `;

    // Converteer naar een dataURI
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/**
 * Genereert een simpel low-res placeholder patroon met CSS
 * Alternatief voor blurhash zonder extra bibliotheek
 * 
 * @param {string} dominantColor - Dominante kleur van het beeld
 * @param {string} accentColor - Tweede kleur voor gradiënt effect
 * @param {number} complexity - Complexiteit van het patroon (1-10)
 * @returns {Object} - CSS properties voor de placeholder
 */
export const getSimplifiedBlur = (dominantColor = '#F3F4F6', accentColor = '#E5E7EB', complexity = 3) => {
    // Standaard gradient richting op basis van complexiteit
    const direction = complexity % 2 === 0 ? '45deg' : '135deg';

    // Genereer background style
    const backgroundStyles = {
        backgroundColor: dominantColor,
        backgroundImage: `linear-gradient(${direction}, ${dominantColor} 0%, ${accentColor} 100%)`,
        backgroundSize: `${complexity * 30}px ${complexity * 30}px`,
        backgroundPosition: 'center',
    };

    return backgroundStyles;
};

/**
 * Extraheert dominante kleur uit een URL in base64 formaat
 * Vereenvoudigde versie - voor geavanceerde versie zou canvas of een library nodig zijn
 * 
 * @param {string} url - Base64 gecodeerde afbeelding URL
 * @returns {string} - Dominante kleur als hex
 */
export const extractDominantColor = (url) => {
    // Voor echte kleurextractie zou je een canvas en pixel analyse nodig hebben
    // Dit is een fallback die gewoon een neutrale kleur teruggeeft
    return '#F3F4F6';
};

/**
 * Genereert een CSS gradient placeholder op basis van twee kleuren
 * 
 * @param {string} color1 - Eerste kleur voor de gradient
 * @param {string} color2 - Tweede kleur voor de gradient
 * @param {string} direction - Gradient richting (bijv. 'to right', '45deg')
 * @returns {string} - CSS background-image waarde
 */
export const generateGradientPlaceholder = (
    color1 = '#F3F4F6',
    color2 = '#E5E7EB',
    direction = 'to right'
) => {
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
};

/**
 * Maakt een noise textuur als data URL om als placeholder te gebruiken
 * 
 * @param {string} baseColor - Basis kleur als hex
 * @param {number} opacity - Opacity van de noise (0-100)
 * @param {number} size - Grootte van de noise in pixels
 * @returns {string} - Data URL voor de noise textuur
 */
export const generateNoiseTexture = (baseColor = '#F3F4F6', opacity = 15, size = 128) => {
    // Bepaal canvas size (een macht van 2 is efficiënt)
    const canvasSize = Math.min(256, Math.max(32, size));

    // Gebruik browser canvas API wanneer beschikbaar, anders standaard placeholder
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = canvasSize;
            canvas.height = canvasSize;

            const ctx = canvas.getContext('2d');

            // Vul met basiskleur
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, canvasSize, canvasSize);

            // Voeg noise toe
            const opacityValue = Math.min(100, Math.max(1, opacity)) / 100;

            for (let x = 0; x < canvasSize; x++) {
                for (let y = 0; y < canvasSize; y++) {
                    // Random grijswaarde
                    const value = Math.floor(Math.random() * 255);

                    ctx.fillStyle = `rgba(${value}, ${value}, ${value}, ${opacityValue})`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }

            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Error generating noise texture:', error);
        }
    }

    // Fallback naar eenvoudige kleur placeholder als canvas niet beschikbaar is
    return getColorPlaceholder(baseColor, canvasSize, canvasSize);
};

export default {
    getBlurFilter,
    getColorPlaceholder,
    getSimplifiedBlur,
    extractDominantColor,
    generateGradientPlaceholder,
    generateNoiseTexture
};