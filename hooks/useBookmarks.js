import { useState, useEffect, useCallback } from 'react';
import {
    getBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    sortBookmarks,
    filterBookmarksByCategory,
    searchBookmarks
} from '../utils/bookmarkUtils';

/**
 * Custom hook for managing bookmarks
 * 
 * @param {Object} options - Hook options
 * @param {string} options.sortBy - Initial sort key (default: 'bookmarkedAt')
 * @param {string} options.sortOrder - Initial sort order (default: 'desc')
 * @param {string} options.categoryFilter - Initial category filter (default: 'all')
 * @returns {Object} Bookmark state and functions
 */
const useBookmarks = ({
    sortBy = 'bookmarkedAt',
    sortOrder = 'desc',
    categoryFilter = 'all'
} = {}) => {
    // State for the bookmarks
    const [bookmarks, setBookmarks] = useState([]);

    // State for filtering and sorting
    const [sorting, setSorting] = useState({ sortBy, sortOrder });
    const [filter, setFilter] = useState({ category: categoryFilter, searchQuery: '' });

    // State to track changes for easier optimization
    const [lastAction, setLastAction] = useState({ type: 'init', timestamp: Date.now() });

    // Load bookmarks from localStorage on first render
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadedBookmarks = getBookmarks();
            setBookmarks(loadedBookmarks);
        }
    }, []);

    // Listen for bookmark changes from other components
    useEffect(() => {
        const handleBookmarkChange = () => {
            const updatedBookmarks = getBookmarks();
            setBookmarks(updatedBookmarks);
        };

        // Listen for the custom event
        window.addEventListener('bookmarkChanged', handleBookmarkChange);

        // Clean up event listener
        return () => {
            window.removeEventListener('bookmarkChanged', handleBookmarkChange);
        };
    }, []);

    // Filtered and sorted bookmarks based on current state
    const processedBookmarks = useCallback(() => {
        let processedData = [...bookmarks];

        // Apply category filter
        if (filter.category !== 'all') {
            processedData = filterBookmarksByCategory(processedData, filter.category);
        }

        // Apply search filter
        if (filter.searchQuery) {
            processedData = searchBookmarks(processedData, filter.searchQuery);
        }

        // Apply sorting
        return sortBookmarks(processedData, sorting.sortBy, sorting.sortOrder);
    }, [bookmarks, filter, sorting]);

    /**
     * Toggle bookmark for a post (add if not bookmarked, remove if already bookmarked)
     * 
     * @param {Object} post - Post to toggle bookmark
     * @returns {boolean} New bookmarked state
     */
    const toggleBookmark = useCallback((post) => {
        if (!post || !post.id) return false;

        const isCurrentlyBookmarked = isBookmarked(post.id);

        if (isCurrentlyBookmarked) {
            const updatedBookmarks = removeBookmark(post.id);
            setBookmarks(updatedBookmarks);
            setLastAction({ type: 'remove', postId: post.id, timestamp: Date.now() });
            return false;
        } else {
            const updatedBookmarks = addBookmark(post);
            setBookmarks(updatedBookmarks);
            setLastAction({ type: 'add', postId: post.id, timestamp: Date.now() });
            return true;
        }
    }, []);

    /**
     * Add a post to bookmarks
     * 
     * @param {Object} post - Post to bookmark
     */
    const addToBookmarks = useCallback((post) => {
        if (!post || !post.id) return;

        if (!isBookmarked(post.id)) {
            const updatedBookmarks = addBookmark(post);
            setBookmarks(updatedBookmarks);
            setLastAction({ type: 'add', postId: post.id, timestamp: Date.now() });
        }
    }, []);

    /**
     * Remove a post from bookmarks
     * 
     * @param {string} postId - ID of post to remove
     */
    const removeFromBookmarks = useCallback((postId) => {
        if (!postId) return;

        const updatedBookmarks = removeBookmark(postId);
        setBookmarks(updatedBookmarks);
        setLastAction({ type: 'remove', postId, timestamp: Date.now() });
    }, []);

    /**
     * Check if a post is bookmarked
     * 
     * @param {string} postId - ID of post to check
     * @returns {boolean} True if post is bookmarked
     */
    const checkIsBookmarked = useCallback((postId) => {
        return isBookmarked(postId);
    }, []);

    /**
     * Clear all bookmarks
     */
    const clearBookmarks = useCallback(() => {
        clearAllBookmarks();
        setBookmarks([]);
        setLastAction({ type: 'clear', timestamp: Date.now() });
    }, []);

    /**
     * Update sorting options
     * 
     * @param {Object} sortOptions - New sort options
     */
    const updateSorting = useCallback(({ sortBy, sortOrder }) => {
        setSorting(prev => ({
            sortBy: sortBy || prev.sortBy,
            sortOrder: sortOrder || prev.sortOrder
        }));
    }, []);

    /**
     * Update filtering options
     * 
     * @param {Object} filterOptions - New filter options
     */
    const updateFilter = useCallback(({ category, searchQuery }) => {
        setFilter(prev => ({
            category: category !== undefined ? category : prev.category,
            searchQuery: searchQuery !== undefined ? searchQuery : prev.searchQuery
        }));
    }, []);

    // Return all the state and functions we need
    return {
        // Data
        bookmarks,
        filteredBookmarks: processedBookmarks(),
        bookmarkCount: bookmarks.length,
        filteredCount: processedBookmarks().length,

        // Sorting and filtering
        sorting,
        filter,

        // Actions
        toggleBookmark,
        addToBookmarks,
        removeFromBookmarks,
        checkIsBookmarked,
        clearBookmarks,
        updateSorting,
        updateFilter,

        // State tracking
        lastAction
    };
};

export default useBookmarks;