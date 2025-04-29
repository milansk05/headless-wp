/**
 * Utility functions for handling bookmarks/favorites functionality
 */

// localStorage key for storing bookmarks
const BOOKMARK_STORAGE_KEY = 'wp_headless_bookmarks';

/**
 * Get all bookmarked posts from localStorage
 * 
 * @returns {Array} Array of bookmarked post objects
 */
export const getBookmarks = () => {
    if (typeof window === 'undefined') return [];

    try {
        const bookmarksJSON = localStorage.getItem(BOOKMARK_STORAGE_KEY);
        return bookmarksJSON ? JSON.parse(bookmarksJSON) : [];
    } catch (error) {
        console.error('Error getting bookmarks from localStorage:', error);
        return [];
    }
};

/**
 * Save a post to bookmarks
 * 
 * @param {Object} post - Post to bookmark
 * @returns {Array} Updated bookmarks array
 */
export const addBookmark = (post) => {
    if (typeof window === 'undefined') return [];

    try {
        // Get current bookmarks
        const currentBookmarks = getBookmarks();

        // Check if post is already bookmarked
        if (currentBookmarks.some(bookmark => bookmark.id === post.id)) {
            return currentBookmarks;
        }

        // Create a simplified post object to save (to save space in localStorage)
        const bookmarkData = {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            date: post.date,
            featuredImage: post.featuredImage,
            categories: post.categories,
            bookmarkedAt: new Date().toISOString()
        };

        // Add to bookmarks
        const updatedBookmarks = [bookmarkData, ...currentBookmarks];

        // Save to localStorage
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updatedBookmarks));

        // Dispatch event for other components to listen to
        dispatchBookmarkEvent({ type: 'add', post: bookmarkData });

        return updatedBookmarks;
    } catch (error) {
        console.error('Error adding bookmark:', error);
        return getBookmarks();
    }
};

/**
 * Remove a post from bookmarks
 * 
 * @param {string} postId - ID of post to remove from bookmarks
 * @returns {Array} Updated bookmarks array
 */
export const removeBookmark = (postId) => {
    if (typeof window === 'undefined') return [];

    try {
        // Get current bookmarks
        const currentBookmarks = getBookmarks();

        // Find the post to be removed
        const postToRemove = currentBookmarks.find(bookmark => bookmark.id === postId);

        // Filter out the post with the given ID
        const updatedBookmarks = currentBookmarks.filter(bookmark => bookmark.id !== postId);

        // Save to localStorage
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updatedBookmarks));

        // Dispatch event
        if (postToRemove) {
            dispatchBookmarkEvent({ type: 'remove', post: postToRemove });
        }

        return updatedBookmarks;
    } catch (error) {
        console.error('Error removing bookmark:', error);
        return getBookmarks();
    }
};

/**
 * Check if a post is bookmarked
 * 
 * @param {string} postId - ID of post to check
 * @returns {boolean} True if post is bookmarked
 */
export const isBookmarked = (postId) => {
    if (typeof window === 'undefined') return false;

    const bookmarks = getBookmarks();
    return bookmarks.some(bookmark => bookmark.id === postId);
};

/**
 * Clear all bookmarks
 * 
 * @returns {boolean} Success status
 */
export const clearAllBookmarks = () => {
    if (typeof window === 'undefined') return false;

    try {
        localStorage.removeItem(BOOKMARK_STORAGE_KEY);

        // Dispatch event
        dispatchBookmarkEvent({ type: 'clear' });

        return true;
    } catch (error) {
        console.error('Error clearing bookmarks:', error);
        return false;
    }
};

/**
 * Dispatch a custom event when bookmarks change
 * 
 * @param {Object} detail - Event details
 */
const dispatchBookmarkEvent = (detail) => {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent('bookmarkChanged', { detail });
    window.dispatchEvent(event);
};

/**
 * Sort bookmarks by different criteria
 * 
 * @param {Array} bookmarks - Array of bookmarks
 * @param {string} sortBy - Sort criteria (date, title, bookmarkedAt)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} Sorted bookmarks
 */
export const sortBookmarks = (bookmarks, sortBy = 'bookmarkedAt', order = 'desc') => {
    if (!bookmarks || !Array.isArray(bookmarks)) return [];

    const sortedBookmarks = [...bookmarks];

    switch (sortBy) {
        case 'date':
            sortedBookmarks.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            });
            break;

        case 'title':
            sortedBookmarks.sort((a, b) => {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                return order === 'asc'
                    ? titleA.localeCompare(titleB)
                    : titleB.localeCompare(titleA);
            });
            break;

        case 'bookmarkedAt':
        default:
            sortedBookmarks.sort((a, b) => {
                const dateA = new Date(a.bookmarkedAt || a.date);
                const dateB = new Date(b.bookmarkedAt || b.date);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            });
    }

    return sortedBookmarks;
};

/**
 * Filter bookmarks by category
 * 
 * @param {Array} bookmarks - Array of bookmarks
 * @param {string} categorySlug - Category slug to filter by
 * @returns {Array} Filtered bookmarks
 */
export const filterBookmarksByCategory = (bookmarks, categorySlug) => {
    if (!categorySlug || categorySlug === 'all') return bookmarks;

    return bookmarks.filter(bookmark =>
        bookmark.categories?.nodes?.some(category => category.slug === categorySlug)
    );
};

/**
 * Search bookmarks by query string
 * 
 * @param {Array} bookmarks - Array of bookmarks
 * @param {string} query - Search query
 * @returns {Array} Filtered bookmarks
 */
export const searchBookmarks = (bookmarks, query) => {
    if (!query) return bookmarks;

    const searchTerm = query.toLowerCase().trim();

    return bookmarks.filter(bookmark => {
        const titleMatch = bookmark.title?.toLowerCase().includes(searchTerm);
        const excerptMatch = bookmark.excerpt?.toLowerCase().includes(searchTerm);
        const categoryMatch = bookmark.categories?.nodes?.some(
            category => category.name.toLowerCase().includes(searchTerm)
        );

        return titleMatch || excerptMatch || categoryMatch;
    });
};

export default {
    getBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    sortBookmarks,
    filterBookmarksByCategory,
    searchBookmarks
};