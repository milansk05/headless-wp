import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBookmarks } from '../utils/bookmarkUtils';
import BookmarkButton from './BookmarkButton';
import FeaturedImage from './FeaturedImage';

/**
 * BookmarkShowcase - Component to showcase user's bookmarks on the homepage/blog
 * 
 * @component
 * @param {Object} props
 * @param {number} props.maxItems - Maximum number of bookmarks to show
 * @param {boolean} props.showIfEmpty - Whether to show component if no bookmarks exist
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Title for the showcase
 */
const BookmarkShowcase = ({
    maxItems = 3,
    showIfEmpty = false,
    className = '',
    title = 'Jouw favorieten'
}) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load bookmarks on component mount and listen for changes
    useEffect(() => {
        const loadBookmarks = () => {
            if (typeof window === 'undefined') return;

            const userBookmarks = getBookmarks();
            // Sort by newest first and take only the max number of items
            const sortedBookmarks = userBookmarks
                .sort((a, b) => new Date(b.bookmarkedAt || b.date) - new Date(a.bookmarkedAt || a.date))
                .slice(0, maxItems);

            setBookmarks(sortedBookmarks);
            setLoading(false);
        };

        // Load initially
        loadBookmarks();

        // Listen for bookmark changes
        const handleBookmarkChange = () => {
            loadBookmarks();
        };

        window.addEventListener('bookmarkChanged', handleBookmarkChange);

        return () => {
            window.removeEventListener('bookmarkChanged', handleBookmarkChange);
        };
    }, [maxItems]);

    // If no bookmarks and we shouldn't show when empty, return null
    if (!loading && bookmarks.length === 0 && !showIfEmpty) {
        return null;
    }

    // Format date in a readable way
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <Link href="/bookmarks" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    Bekijk alle
                </Link>
            </div>

            {loading ? (
                <div className="py-6 text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-gray-200 border-t-blue-600 rounded-full mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Laden...</p>
                </div>
            ) : bookmarks.length > 0 ? (
                <div className="space-y-4">
                    {bookmarks.map(bookmark => (
                        <div key={bookmark.id} className="flex border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            {/* Thumbnail image if available */}
                            <div className="flex-shrink-0 w-20 h-16 relative overflow-hidden rounded bg-gray-100 mr-4">
                                {bookmark.featuredImage?.node ? (
                                    <FeaturedImage
                                        featuredImage={bookmark.featuredImage}
                                        postTitle={bookmark.title}
                                        className="w-full h-full"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <Link href={`/posts/${bookmark.slug}`} className="block">
                                    <h3 className="text-sm font-medium text-gray-900 truncate hover:text-blue-600">
                                        {bookmark.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-500">
                                        {formatDate(bookmark.date)}
                                    </span>
                                    <BookmarkButton
                                        post={bookmark}
                                        size="sm"
                                        showLabel={false}
                                        className="text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <p className="mt-2 text-gray-500">Je hebt nog geen favorieten opgeslagen.</p>
                    <p className="mt-1 text-sm text-gray-400">
                        Klik op het bladwijzer icoon bij artikelen om ze hier toe te voegen.
                    </p>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                    href="/bookmarks"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center"
                >
                    <span>Beheer favorieten</span>
                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default BookmarkShowcase;