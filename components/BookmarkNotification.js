import { useState, useEffect } from 'react';
import { getBookmarks } from '../utils/bookmarkUtils';
import Link from 'next/link';

/**
 * BookmarkNotification component - Shows a notification when a user bookmarks their first item
 * or when their bookmark count reaches certain thresholds.
 * 
 * @component
 * @param {Object} props
 * @param {number} props.threshold - At which count to show notification (default: 1 for first bookmark)
 * @param {number} props.duration - How long to show the notification in ms (default: 5000)
 * @param {string} props.position - Where to position the notification (default: 'bottom-right')
 */
const BookmarkNotification = ({
    threshold = 1,
    duration = 5000,
    position = 'bottom-right'
}) => {
    const [show, setShow] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [hasShownForThisCount, setHasShownForThisCount] = useState(false);

    // Position classes based on the position prop
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    // Check bookmarks on mount and listen for changes
    useEffect(() => {
        const checkBookmarks = () => {
            if (typeof window === 'undefined') return;

            const storedShownKey = `bookmark_notification_shown_${threshold}`;
            const hasShownBefore = localStorage.getItem(storedShownKey) === 'true';

            // Get current bookmarks
            const bookmarks = getBookmarks();
            setBookmarkCount(bookmarks.length);

            // Show notification if we hit the threshold and haven't shown it before
            if (bookmarks.length === threshold && !hasShownBefore && !hasShownForThisCount) {
                setShow(true);
                setHasShownForThisCount(true);

                // Store that we've shown this notification
                localStorage.setItem(storedShownKey, 'true');

                // Hide after duration
                setTimeout(() => {
                    setShow(false);
                }, duration);
            }
        };

        // Check initially
        checkBookmarks();

        // Listen for bookmark changes
        const handleBookmarkChange = () => {
            checkBookmarks();
        };

        window.addEventListener('bookmarkChanged', handleBookmarkChange);

        return () => {
            window.removeEventListener('bookmarkChanged', handleBookmarkChange);
        };
    }, [threshold, duration, hasShownForThisCount]);

    // Different messages based on the threshold
    const getMessage = () => {
        if (threshold === 1) {
            return {
                title: 'Eerste favoriet opgeslagen!',
                body: 'Je eerste artikel is opgeslagen. Bekijk al je favorieten op je persoonlijke bookmarkpagina.'
            };
        } else if (threshold === 5) {
            return {
                title: 'Mooie collectie!',
                body: 'Je hebt nu 5 artikelen opgeslagen. Je bouwt een mooie collectie op.'
            };
        } else {
            return {
                title: 'Favoriet opgeslagen',
                body: `Je hebt nu ${bookmarkCount} artikelen opgeslagen.`
            };
        }
    };

    const message = getMessage();

    // Don't render anything if we shouldn't show
    if (!show) return null;

    return (
        <div className={`fixed z-50 ${positionClasses[position] || positionClasses['bottom-right']}`}>
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm transform transition-transform duration-500 ease-out animate-slide-in">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <svg className="h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{message.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{message.body}</p>
                        <div className="mt-4">
                            <Link
                                href="/bookmarks"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Bekijk favorieten →
                            </Link>
                        </div>
                    </div>
                    <button
                        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShow(false)}
                    >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookmarkNotification;