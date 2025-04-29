import { useState, useEffect } from 'react';
import { isBookmarked, addBookmark, removeBookmark } from '../utils/bookmarkUtils';

/**
 * BookmarkButton component for toggling bookmark status of a post
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.post - The post to bookmark
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size of the button ('sm', 'md', 'lg')
 * @param {boolean} props.showLabel - Whether to show the text label
 * @param {boolean} props.withAnimation - Whether to show animation effects
 * @param {function} props.onToggle - Callback function when bookmark is toggled
 */
const BookmarkButton = ({
    post,
    className = '',
    size = 'md',
    showLabel = true,
    withAnimation = true,
    onToggle = null
}) => {
    // State for bookmark status
    const [isActive, setIsActive] = useState(false);
    // Animation state
    const [isAnimating, setIsAnimating] = useState(false);

    // Check initial bookmark status
    useEffect(() => {
        if (post?.id) {
            setIsActive(isBookmarked(post.id));
        }
    }, [post]);

    // Listen for bookmark changes from other components
    useEffect(() => {
        const handleBookmarkChange = (event) => {
            if (post?.id && event.detail?.post?.id === post.id) {
                setIsActive(event.detail.type === 'add');
            }
        };

        window.addEventListener('bookmarkChanged', handleBookmarkChange);

        return () => {
            window.removeEventListener('bookmarkChanged', handleBookmarkChange);
        };
    }, [post]);

    // Handle click on bookmark button
    const handleToggleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!post) return;

        // Toggle bookmark status
        if (isActive) {
            removeBookmark(post.id);
            setIsActive(false);
        } else {
            addBookmark(post);
            setIsActive(true);
        }

        // Run animation if enabled
        if (withAnimation) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 700);
        }

        // Callback if provided
        if (onToggle) {
            onToggle(!isActive, post);
        }
    };

    // Size class mapping
    const sizeClasses = {
        sm: 'p-1 text-xs',
        md: 'p-2 text-sm',
        lg: 'p-3 text-base'
    };

    // Icon size mapping
    const iconSize = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <button
            onClick={handleToggleBookmark}
            className={`
        ${sizeClasses[size] || sizeClasses.md}
        ${isActive ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-500 hover:text-gray-700'}
        ${isAnimating ? 'scale-110' : 'scale-100'}
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md
        flex items-center justify-center
        ${className}
      `}
            aria-label={isActive ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
            title={isActive ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
        >
            <span className={`${iconSize[size] || iconSize.md} relative`}>
                {isActive ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`
              ${isAnimating ? 'animate-pulse' : ''}
              transition-all duration-300
            `}
                    >
                        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="transition-all duration-200"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                )}
            </span>

            {showLabel && (
                <span className="ml-1 whitespace-nowrap">
                    {isActive ? 'Opgeslagen' : 'Opslaan'}
                </span>
            )}
        </button>
    );
};

export default BookmarkButton;