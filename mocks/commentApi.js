// commentApi.js - Mock implementation for comments and votes with localStorage persistence

/**
 * Get comments from storage or initialize with defaults
 */
const getStoredComments = () => {
    if (typeof window === 'undefined') {
        return [
            {
                id: '1',
                authorName: 'John Doe',
                content: 'Dit is een voorbeeld comment',
                date: new Date().toISOString(),
                voteScore: 5
            },
            {
                id: '2',
                authorName: 'Jane Smith',
                content: 'Nog een comment om te testen',
                date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                voteScore: 2
            }
        ];
    }

    try {
        const storedComments = localStorage.getItem('mock_comments');
        return storedComments ? JSON.parse(storedComments) : [
            {
                id: '1',
                authorName: 'John Doe',
                content: 'Dit is een voorbeeld comment',
                date: new Date().toISOString(),
                voteScore: 5
            },
            {
                id: '2',
                authorName: 'Jane Smith',
                content: 'Nog een comment om te testen',
                date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                voteScore: 2
            }
        ];
    } catch (error) {
        console.error('Error loading stored comments:', error);
        return [
            {
                id: '1',
                authorName: 'John Doe',
                content: 'Dit is een voorbeeld comment',
                date: new Date().toISOString(),
                voteScore: 5
            },
            {
                id: '2',
                authorName: 'Jane Smith',
                content: 'Nog een comment om te testen',
                date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                voteScore: 2
            }
        ];
    }
};

/**
 * Get device votes from storage or initialize empty
 */
const getStoredDeviceVotes = () => {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const storedVotes = localStorage.getItem('mock_device_votes');
        return storedVotes ? JSON.parse(storedVotes) : {};
    } catch (error) {
        console.error('Error loading stored device votes:', error);
        return {};
    }
};

/**
 * Get comment scores from storage or initialize with defaults
 */
const getStoredCommentScores = () => {
    if (typeof window === 'undefined') {
        return { '1': 5, '2': 2 };
    }

    try {
        const storedScores = localStorage.getItem('mock_comment_scores');
        return storedScores ? JSON.parse(storedScores) : { '1': 5, '2': 2 };
    } catch (error) {
        console.error('Error loading stored comment scores:', error);
        return { '1': 5, '2': 2 };
    }
};

// Initialize our mock database
let commentsDb = getStoredComments();

// Map to track which device voted on which comment
// Format: { [deviceId_commentId]: voteType }
let deviceVotes = getStoredDeviceVotes();

// Map to track comment vote counts
// Format: { [commentId]: voteCount }
let commentScores = getStoredCommentScores();

/**
 * Save current state to localStorage for persistence
 */
const saveState = () => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem('mock_comments', JSON.stringify(commentsDb));
        localStorage.setItem('mock_device_votes', JSON.stringify(deviceVotes));
        localStorage.setItem('mock_comment_scores', JSON.stringify(commentScores));
    } catch (error) {
        console.error('Error saving mock state:', error);
    }
};

/**
 * Format comments for frontend display
 */
export const getFormattedComments = () => {
    return commentsDb.map(comment => ({
        ...comment,
        voteScore: commentScores[comment.id] || 0
    }));
};

/**
 * Get vote status for a specific device ID and comment
 */
export const getVoteStatus = (commentId, deviceId) => {
    const key = `${deviceId}_${commentId}`;
    return deviceVotes[key] || 'none';
};

/**
 * Register a vote for a comment
 */
export const registerVote = (commentId, voteType, deviceId) => {
    const key = `${deviceId}_${commentId}`;
    const oldVote = deviceVotes[key] || 'none';

    // Calculate vote delta based on old vote and new vote
    let scoreDelta = 0;

    if (voteType === 'up') {
        scoreDelta = oldVote === 'down' ? 2 : (oldVote === 'up' ? 0 : 1);
    } else if (voteType === 'down') {
        scoreDelta = oldVote === 'up' ? -2 : (oldVote === 'down' ? 0 : -1);
    } else if (voteType === 'none') {
        scoreDelta = oldVote === 'up' ? -1 : (oldVote === 'down' ? 1 : 0);
    }

    // Update vote store
    if (voteType === 'none') {
        delete deviceVotes[key];
    } else {
        deviceVotes[key] = voteType;
    }

    // Make sure the comment score exists
    if (!commentScores[commentId]) {
        commentScores[commentId] = 0;
    }

    // Update the comment score
    commentScores[commentId] += scoreDelta;

    // Save state to localStorage
    saveState();

    return {
        success: true,
        commentId,
        voteType,
        voteCount: commentScores[commentId],
        message: 'Vote geregistreerd'
    };
};

/**
 * Add a new comment
 */
export const addComment = (postId, name, email, content) => {
    const newComment = {
        id: String(Date.now()),
        authorName: name,
        content,
        date: new Date().toISOString(),
        voteScore: 0
    };

    commentsDb.push(newComment);

    // Initialize the comment score
    commentScores[newComment.id] = 0;

    // Save state to localStorage
    saveState();

    return {
        success: true,
        comment: newComment,
        message: 'Comment toegevoegd'
    };
};