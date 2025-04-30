import { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = ({ className = '', onSearch = () => { }, placeholder = 'Zoeken...' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            if (onSearch) onSearch(searchTerm);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle input click - prevent immediate redirection
    const handleInputClick = (e) => {
        // Prevent any default behaviors but keep focus
        e.stopPropagation();
    };

    return (
        <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                onClick={handleInputClick}
                className="w-full px-4 py-2 rounded-l-full text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                aria-label="Zoeken"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-full transition"
                aria-label="Zoeken"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </form>
    );
};

export default SearchBar;