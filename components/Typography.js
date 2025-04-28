import React from 'react';

/**
 * Typography component voor consistente tekstopmaak in de hele applicatie
 * 
 * @param {Object} props Component properties
 * @param {string} props.variant Type van het tekstcomponent (h1, h2, h3, h4, p, lead, small, blockquote)
 * @param {string} props.className Extra CSS-klassen
 * @param {boolean} props.serif Gebruik serif lettertype
 * @param {boolean} props.mono Gebruik monospace lettertype
 * @param {boolean} props.display Gebruik display lettertype
 * @param {string} props.align Tekstuitlijning (left, center, right, justify)
 * @param {boolean} props.gutterBottom Voeg onderste marge toe
 * @param {JSX.Element | string} props.children Content binnenin het element
 */
const Typography = ({
    variant = 'p',
    className = '',
    serif = false,
    mono = false,
    display = false,
    align = 'left',
    gutterBottom = false,
    children,
    ...rest
}) => {
    // Bepaal lettertype klasse op basis van props
    const fontClass = mono
        ? 'font-mono'
        : serif
            ? 'font-serif'
            : display
                ? 'font-display'
                : 'font-sans';

    // Bepaal de standaard styling op basis van de variant
    const variantStyles = {
        h1: 'text-4xl md:text-5xl font-bold leading-tight tracking-tight font-display text-gray-900',
        h2: 'text-3xl md:text-4xl font-bold leading-tight tracking-tight font-display text-gray-900',
        h3: 'text-2xl md:text-3xl font-semibold leading-tight tracking-tight font-display text-gray-900',
        h4: 'text-xl md:text-2xl font-semibold leading-snug text-gray-900',
        h5: 'text-lg md:text-xl font-medium leading-snug text-gray-900',
        h6: 'text-base md:text-lg font-medium leading-normal text-gray-900',
        subtitle1: 'text-xl font-normal leading-normal text-gray-700',
        subtitle2: 'text-lg font-medium leading-normal text-gray-600',
        p: 'text-base leading-relaxed text-gray-700',
        lead: 'text-xl leading-relaxed font-normal text-gray-600',
        body1: 'text-base leading-relaxed text-gray-700',
        body2: 'text-sm leading-relaxed text-gray-600',
        small: 'text-sm leading-normal text-gray-500',
        tiny: 'text-xs leading-normal text-gray-500',
        blockquote: 'pl-4 border-l-4 border-blue-500 italic text-gray-700 bg-blue-50 py-2 px-3 rounded-r',
        caption: 'text-sm italic text-gray-500'
    };

    // Combineer alle styling classes
    const combinedClasses = `
    ${variantStyles[variant] || variantStyles.p}
    ${fontClass}
    ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : align === 'justify' ? 'text-justify' : 'text-left'}
    ${gutterBottom ? 'mb-6' : ''}
    ${className}
  `.trim();

    // Render het juiste element op basis van variant
    const Component = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)
        ? variant
        : variant === 'blockquote'
            ? 'blockquote'
            : 'p';

    return (
        <Component className={combinedClasses} {...rest}>
            {children}
        </Component>
    );
};

export default Typography;