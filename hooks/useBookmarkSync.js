const useBookmarkSync = () => {
    // State to track bookmark count and sync status
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [syncEnabled, setSyncEnabled] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [hasConflicts, setHasConflicts] = useState(false);

    // Initialize and set up event listeners
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if localStorage is available (sync enabled)
        try {
            const testKey = 'bookmark_sync_test';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            setSyncEnabled(true);
        } catch (error) {
            console.error('localStorage is not available for bookmark sync:', error);
            setSyncEnabled(false);
            return; // exit early if localStorage isn't available
        }

        // Initial bookmark count
        const bookmarks = getBookmarks();
        setBookmarkCount(bookmarks.length);

        // Function to handle storage events (changes in other tabs/windows)
        const handleStorageChange = (event) => {
            if (event.key === 'wp_headless_bookmarks') {
                // Get the current bookmarks from this tab
                const currentBookmarks = getBookmarks();
                setBookmarkCount(currentBookmarks.length);
                setLastSyncTime(Date.now());
            }
        };

        // Function to handle custom bookmark change events
        const handleBookmarkChange = () => {
            const bookmarks = getBookmarks();
            setBookmarkCount(bookmarks.length);
            setLastSyncTime(Date.now());
        };

        // Listen for localStorage changes from other tabs
        window.addEventListener('storage', handleStorageChange);

        // Listen for bookmark changes in current tab
        window.addEventListener('bookmarkChanged', handleBookmarkChange);

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('bookmarkChanged', handleBookmarkChange);
        };
    }, []);

    /**
     * Resolve sync conflicts by merging bookmarks
     * This is a placeholder for a more sophisticated conflict resolution
     */
    const resolveSyncConflicts = () => {
        if (!hasConflicts) return;

        // For now, we just acknowledge conflicts are resolved
        setHasConflicts(false);
        setLastSyncTime(Date.now());
    };

    return {
        syncEnabled,
        bookmarkCount,
        lastSyncTime,
        hasConflicts,
        resolveSyncConflicts
    };
};

export default useBookmarkSync; import { useState, useEffect } from 'react';
import { getBookmarks } from '../utils/bookmarkUtils';

/**
 * useBookmarkSync - Hook to sync bookmarks between tabs and windows
 * 
 * This hook listens for bookmark changes across browser tabs/windows
 * using the localStorage 'storage' event and keeps state in sync.
 * 
 * @returns {Object} bookmarkSync - Information about bookmark sync status
 * @returns {boolean} bookmarkSync.syncEnabled - Whether sync is working
 * @returns {number} bookmarkSync.bookmarkCount - Current bookmark count
 * @returns {number} bookmarkSync.lastSyncTime - Timestamp of last sync
 * @returns {boolean} bookmarkSync.hasConflicts - Whether there are sync conflicts
 * @returns {Function} bookmarkSync.resolveSyncConflicts - Function to resolve conflicts
 */