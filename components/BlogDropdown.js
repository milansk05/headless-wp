// components/BlogDropdown.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchAPI } from '../lib/api';
import { GET_ALL_POSTS } from '../lib/queries';

/**
 * BlogDropdown - Component voor het tonen van recente artikelen in een dropdown
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isScrolled - Of de pagina is gescrolled
 * @param {boolean} props.isActive - Of het dropdown item actief is (huidige route)
 */
const BlogDropdown = ({ isScrolled, isActive }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    // Fetch recent posts
    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchAPI(GET_ALL_POSTS);
                if (data?.posts?.nodes) {
                    // Take most recent 5 posts
                    setPosts(data.posts.nodes.slice(0, 5));
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recent posts:', error);
                setLoading(false);
            }
        };

        fetchRecentPosts();
    }, []);

    // Handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown after navigation
    const handleNavigation = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${isActive
                        ? isScrolled
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'bg-white/20 text-white font-medium'
                        : isScrolled
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-white hover:bg-white/10'
                    }`}
                aria-expanded={isOpen}
            >
                Blog
                <svg
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute left-0 mt-2 w-64 rounded-md shadow-lg z-50 ${isScrolled
                        ? 'bg-white border border-gray-200'
                        : 'bg-blue-800 border border-blue-700'
                    }`}>
                    <div className="py-1">
                        {/* Header */}
                        <div className="px-4 py-2 border-b border-gray-200 border-opacity-20">
                            <span className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'
                                }`}>
                                Recente Artikelen
                            </span>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="px-4 py-2 text-center">
                                <div className={`inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 ${isScrolled ? 'border-blue-500' : 'border-white'
                                    }`}></div>
                                <span className={`ml-2 text-sm ${isScrolled ? 'text-gray-600' : 'text-gray-300'
                                    }`}>
                                    Laden...
                                </span>
                            </div>
                        )}

                        {/* Post items */}
                        {!loading && posts.map(post => (
                            <Link
                                key={post.id}
                                href={`/posts/${post.slug}`}
                                className={`block px-4 py-2 text-sm transition-colors ${isScrolled
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-white hover:bg-blue-700'
                                    }`}
                                onClick={handleNavigation}
                            >
                                {post.title}
                            </Link>
                        ))}

                        {/* No posts state */}
                        {!loading && posts.length === 0 && (
                            <div className="px-4 py-2 text-sm">
                                <span className={isScrolled ? 'text-gray-600' : 'text-gray-300'}>
                                    Geen artikelen gevonden
                                </span>
                            </div>
                        )}

                        {/* Footer links */}
                        <div className="border-t border-gray-200 border-opacity-20 py-1 px-4">
                            <Link
                                href="/blog"
                                className={`block py-2 text-sm font-medium ${isScrolled
                                        ? 'text-blue-600 hover:text-blue-800'
                                        : 'text-blue-300 hover:text-white'
                                    }`}
                                onClick={handleNavigation}
                            >
                                Alle artikelen →
                            </Link>

                            <Link
                                href="/categories"
                                className={`block py-2 text-sm ${isScrolled
                                        ? 'text-gray-600 hover:text-blue-800'
                                        : 'text-gray-300 hover:text-white'
                                    }`}
                                onClick={handleNavigation}
                            >
                                Categorieën
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDropdown;