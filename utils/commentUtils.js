// commentUtils.js

/**
 * Formats a list of comments with vote information
 * 
 * @param {Array} comments - The comments to format
 * @returns {Array} - Formatted comments
 */
export const formatCommentsWithVotes = (comments = []) => {
  if (!comments || !Array.isArray(comments)) {
    console.warn('Invalid comments array provided to formatCommentsWithVotes');
    return [];
  }

  return comments.map(comment => {
    // Create a deep copy of the comment object
    const formattedComment = {
      ...comment,
      id: comment.commentId || comment.id,
      authorName: comment.author?.node?.name || 'Anoniem',
      content: comment.content || '',
      date: comment.date || new Date().toISOString(),
      voteScore: comment.voteScore || 0
    };

    return formattedComment;
  });
};

/**
 * Sorts comments based on the chosen sort option
 * 
 * @param {Array} comments - The comments to sort
 * @param {string} sortOption - The sort option ('newest', 'oldest', 'popular')
 * @returns {Array} - Sorted comments
 */
export const sortComments = (comments = [], sortOption = 'newest') => {
  const commentsCopy = [...comments];

  switch (sortOption) {
    case 'newest':
      return commentsCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return commentsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'popular':
      return commentsCopy.sort((a, b) => (b.voteScore || 0) - (a.voteScore || 0));
    default:
      return commentsCopy;
  }
};

/**
 * Gets the vote status for a specific comment
 * 
 * @param {string} commentId - ID of the comment
 * @returns {Promise<string>} - Promise that resolves with the vote status ('up', 'down', or 'none')
 */
export const getUserVote = async (commentId) => {
  try {
    const response = await fetch(`/api/comments/vote-status?commentId=${commentId}`);
    if (!response.ok) {
      console.error('Failed to get vote status, status code:', response.status);
      return 'none';
    }

    const data = await response.json();
    return data.success ? data.voteStatus : 'none';
  } catch (error) {
    console.error('Error getting vote status:', error);
    return 'none';
  }
};

/**
 * Saves a vote for a comment
 * This function is kept for backward compatibility, but direct API calls
 * are now preferred from the Comment component
 * 
 * @param {string} commentId - ID of the comment
 * @param {string} voteType - Type of vote ('up', 'down', or 'none')
 * @returns {Promise} - Promise that resolves with the API response
 */
export const saveCommentVote = async (commentId, voteType) => {
  try {
    const response = await fetch('/api/comments/vote', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId,
        voteType
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Could not save vote');
    }

    const data = await response.json();

    // Dispatch event so other components know a vote has changed
    if (data.success && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('commentVoteChanged', {
        detail: {
          commentId,
          vote: voteType,
          newScore: data.voteCount
        }
      }));
    }

    return data;
  } catch (error) {
    console.error('Error saving vote:', error);
    throw error;
  }
};