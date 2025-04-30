/**
 * Utility functions for comment management
 */

// Store votes in localStorage
export const saveCommentVote = (commentId, vote) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Get existing votes
    const votes = getCommentVotes();
    
    // Update the vote for this comment
    votes[commentId] = vote;
    
    // Save back to localStorage
    localStorage.setItem('commentVotes', JSON.stringify(votes));
    
    // Dispatch an event so other components can update
    window.dispatchEvent(new CustomEvent('commentVoteChanged', {
      detail: { commentId, vote }
    }));
  } catch (error) {
    console.error('Error saving comment vote:', error);
  }
};

// Get votes from localStorage
export const getCommentVotes = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    const votes = localStorage.getItem('commentVotes');
    return votes ? JSON.parse(votes) : {};
  } catch (error) {
    console.error('Error getting comment votes:', error);
    return {};
  }
};

// Get user's vote for a specific comment
export const getUserVote = (commentId) => {
  const votes = getCommentVotes();
  return votes[commentId] || 0; // 0 means no vote
};

// Format comments with votes
export const formatCommentsWithVotes = (comments, votes = {}) => {
  if (!comments || !Array.isArray(comments)) {
    return [];
  }
  
  // Add vote information to each comment
  const enhancedComments = comments.map(comment => ({
    ...comment,
    userVote: votes[comment.id] || 0,
    voteScore: comment.voteScore || 0
  }));
  
  return enhancedComments;
};

// Sort comments based on different criteria
export const sortComments = (comments, sortBy = 'newest') => {
  if (!comments || !Array.isArray(comments)) {
    return [];
  }
  
  const sortedComments = [...comments];
  
  switch (sortBy) {
    case 'newest':
      return sortedComments.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return sortedComments.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'popular':
      return sortedComments.sort((a, b) => b.voteScore - a.voteScore);
    default:
      return sortedComments;
  }
};
