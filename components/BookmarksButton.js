import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBookmarks } from '../utils/bookmarkUtils';

/**
 * BookmarksButton component for the header with bookmark count badge
 * 
 * @component
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 */
const BookmarksButton = ({ className = '' }) => {
    const [bookmarkCount, setBookmarkCount] = useState(0);

    // Update count when bookmarks change
    useEffect(() => {
        const updateCount = () => {
            if (typeof window !== 'undefined') {
                const bookmarks = getBookmarks();
                setBookmarkCount(bookmarks.length);
            }
        };

        // Initial count
        updateCount();

        // Listen for bookmark changes
        window.addEventListener('bookmarkChanged', updateCount);

        return () => {
            window.removeEventListener('bookmarkChanged', updateCount);
        };
    }, []);

    return (
        <Link
            href="/bookmarks"
            className={`relative p-2 flex items-center transition-colors rounded ${className}`}
            aria-label="Mijn favorieten"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </svg>

            <span className="ml-1">Favorieten</span>

            {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {bookmarkCount > 99 ? '99+' : bookmarkCount}
                </span>
            )}
        </Link>
    );
};

export default BookmarksButton;