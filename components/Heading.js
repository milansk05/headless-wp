import React from 'react';

/**
 * Geavanceerd Heading component met typografische verbeteringen
 * 
 * @param {Object} props Component eigenschappen
 * @param {string} props.as HTML-element voor de heading (h1, h2, h3, h4, h5, h6)
 * @param {string} props.size Visuele grootte, onafhankelijk van HTML-element (1, 2, 3, 4, 5, 6)
 * @param {string} props.variant Visuele variant (default, section, decorated, numbered)
 * @param {string} props.align Tekstuitlijning (left, center, right)
 * @param {boolean} props.serif Gebruik serif lettertype
 * @param {boolean} props.noMargin Verwijder standaard marges
 * @param {string} props.className Extra CSS-klassen
 * @param {JSX.Element | string} props.children Inhoud van de heading
 */
const Heading = ({
    as = 'h2',
    size,
    variant = 'default',
    align = 'left',
    serif = false,
    noMargin = false,
    className = '',
    children,
    ...rest
}) => {
    // Bepaal effectieve grootte: als size niet is gespecificeerd, gebruik de standaard voor het element
    const effectiveSize = size || (as === 'h1' ? '1' : as === 'h2' ? '2' : as === 'h3' ? '3' : as === 'h4' ? '4' : as === 'h5' ? '5' : '6');

    // Styling op basis van grootte
    const sizeClasses = {
        '1': 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight',
        '2': 'text-3xl md:text-4xl font-bold tracking-tight leading-tight',
        '3': 'text-2xl md:text-3xl font-semibold tracking-tight leading-tight',
        '4': 'text-xl md:text-2xl font-semibold leading-snug',
        '5': 'text-lg md:text-xl font-medium leading-snug',
        '6': 'text-base md:text-lg font-medium leading-normal',
    };

    // Styling op basis van variant
    const variantClasses = {
        default: '',
        section: 'border-b border-gray-200 pb-2',
        decorated: 'relative pl-3 border-l-4 border-blue-500',
        numbered: 'relative',
        underlined: 'relative after:absolute after:left-0 after:bottom-0 after:h-1 after:w-24 after:bg-blue-500 pb-3',
        centered: 'mx-auto text-center max-w-4xl',
        gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600',
    };

    // Combineer alle styling classes
    const combinedClasses = `
    ${sizeClasses[effectiveSize] || sizeClasses['2']}
    ${variantClasses[variant] || ''}
    ${serif ? 'font-serif' : 'font-display'}
    ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''}
    ${noMargin ? '' : 'mb-6 mt-12'}
    text-gray-900
    ${className}
  `.trim();

    // Render het juiste heading element
    const Component = as;

    // Speciaal geval voor genummerde headings
    if (variant === 'numbered') {
        const number = rest['data-number'] || '1';

        return (
            <div className="relative">
                <span className="absolute -left-12 top-1 text-5xl font-bold text-gray-200 font-display">
                    {number}.
                </span>
                <Component className={combinedClasses} {...rest}>
                    {children}
                </Component>
            </div>
        );
    }

    return (
        <Component className={combinedClasses} {...rest}>
            {children}
        </Component>
    );
};

export default Heading;