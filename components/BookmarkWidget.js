import { useState, useEffect } from 'react';
import BookmarkButton from './BookmarkButton';
import Link from 'next/link';
import { getBookmarks } from '../utils/bookmarkUtils';

/**
 * BookmarkWidget component that shows a bookmark button and 
 * information about existing bookmarks
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.post - The post to display the widget for
 * @param {string} props.className - Additional CSS class for styling
 */
const BookmarkWidget = ({ post, className = '' }) => {
    const [bookmarksCount, setBookmarksCount] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);

    // Update bookmarks count when bookmarks change
    useEffect(() => {
        const updateCount = () => {
            const bookmarks = getBookmarks();
            setBookmarksCount(bookmarks.length);
        };

        // Update count initially
        updateCount();

        // Listen for changes to bookmarks
        window.addEventListener('bookmarkChanged', updateCount);

        return () => {
            window.removeEventListener('bookmarkChanged', updateCount);
        };
    }, []);

    // Show tooltip temporarily when clicked
    const handleBookmarkToggle = (isBookmarked) => {
        if (isBookmarked) {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
        }
    };

    return (
        <div className={`bg-blue-50 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Artikel opslaan</h3>
                    <p className="text-sm text-gray-600">
                        Bewaar dit artikel voor later
                    </p>
                </div>

                <BookmarkButton
                    post={post}
                    size="lg"
                    className="flex-shrink-0 py-2 px-4"
                    withAnimation={true}
                    onToggle={handleBookmarkToggle}
                />
            </div>

            {/* Tooltip that shows when bookmark is added */}
            {showTooltip && (
                <div className="mt-2 text-sm bg-blue-100 text-blue-800 p-2 rounded-md">
                    Artikel toegevoegd aan je favorieten!
                    <Link
                        href="/bookmarks"
                        className="font-medium underline ml-1"
                    >
                        Bekijk alle favorieten
                    </Link>
                </div>
            )}

            {/* Show link to bookmarks if user has any */}
            {bookmarksCount > 0 && !showTooltip && (
                <div className="mt-3 text-sm">
                    <Link
                        href="/bookmarks"
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                    >
                        <span>
                            Bekijk je {bookmarksCount} opgeslagen {bookmarksCount === 1 ? 'artikel' : 'artikelen'}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default BookmarkWidget;