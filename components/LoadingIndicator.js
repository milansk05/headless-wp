import React from 'react';

const LoadingIndicator = ({ size = 'medium', message = 'Laden...' }) => {
    // Grootte configuraties
    const sizes = {
        small: {
            spinnerSize: 'h-4 w-4',
            textSize: 'text-xs'
        },
        medium: {
            spinnerSize: 'h-8 w-8',
            textSize: 'text-sm'
        },
        large: {
            spinnerSize: 'h-12 w-12',
            textSize: 'text-base'
        }
    };

    const { spinnerSize, textSize } = sizes[size] || sizes.medium;

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-blue-500`}></div>
            {message && <p className={`mt-2 ${textSize} text-gray-600`}>{message}</p>}
        </div>
    );
};

export default LoadingIndicator;