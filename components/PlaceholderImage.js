import React from 'react';

/**
 * PlaceholderImage - Component voor het weergeven van placeholder afbeeldingen
 * 
 * @component
 * @param {Object} props
 * @param {number} props.width - Breedte van de placeholder
 * @param {number} props.height - Hoogte van de placeholder
 * @param {string} props.text - Optionele tekst om weer te geven
 * @param {string} props.bgColor - Achtergrondkleur
 * @param {string} props.textColor - Tekstkleur
 * @param {string} props.className - Extra CSS klassen
 */
const PlaceholderImage = ({
    width = 400,
    height = 300,
    text = 'Geen afbeelding',
    bgColor = 'bg-gray-200',
    textColor = 'text-gray-500',
    className = '',
}) => {
    return (
        <div
            className={`flex items-center justify-center ${bgColor} ${textColor} ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
            role="img"
            aria-label={text}
        >
            <div className="flex flex-col items-center">
                <svg
                    className="w-12 h-12 mb-2 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                {text && <span className="text-sm font-medium">{text}</span>}
            </div>
        </div>
    );
};

export default PlaceholderImage;