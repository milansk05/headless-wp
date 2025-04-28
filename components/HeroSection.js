import React from 'react';
import SearchBar from './SearchBar';
import { useContext } from 'react';
import { SiteContext } from '../pages/_app';

const HeroSection = () => {
    const { siteSettings } = useContext(SiteContext);

    return (
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-16 md:py-24 relative overflow-hidden">
            {/* Decoratieve achtergrond elementen */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-3/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-3/4 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 text-center relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight tracking-tight">
                    {siteSettings.title || 'headless-wp'}
                </h1>

                <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-8">
                    {siteSettings.description || 'Een persoonlijke blog'}
                </p>

                <div className="max-w-md mx-auto">
                    <SearchBar
                        className="bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-300/50"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;