// commentUtils.js
import { VOTE_COMMENT } from '../lib/api';

/**
 * Formatteert een lijst van comments met vote informatie
 * 
 * @param {Array} comments - De comments om te formatteren
 * @param {Object} userVotes - Map van comment ID's naar vote status (optional, not used in new version)
 * @returns {Array} - Geformatteerde comments
 */
export const formatCommentsWithVotes = (comments = [], userVotes = {}) => {
  return comments.map(comment => {
    // Maak een diepere kopie van het comment object
    const formattedComment = {
      ...comment,
      id: comment.commentId || comment.id,
      authorName: comment.author?.node?.name || 'Anoniem',
      content: comment.content || '',
      date: comment.date || new Date().toISOString(),
      voteScore: comment.voteScore || 0,

      // Votes komen nu van de server, dus we hoeven niet meer naar userVotes te kijken
      // userVote wordt nu ingesteld op componentniveau na een API call
    };

    return formattedComment;
  });
};

/**
 * Sorteert comments op basis van de gekozen sort optie
 * 
 * @param {Array} comments - De te sorteren comments
 * @param {string} sortOption - De sorteer optie ('newest', 'oldest', 'popular')
 * @returns {Array} - Gesorteerde comments
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
 * Haalt de vote status op voor een specifiek comment
 * 
 * @param {string} commentId - ID van het comment
 * @returns {string} - Vote status ('up', 'down', of 'none')
 */
export const getUserVote = async (commentId) => {
  try {
    const response = await fetch(`/api/comments/vote-status?commentId=${commentId}`);
    if (!response.ok) throw new Error('Kon vote status niet ophalen');

    const data = await response.json();
    return data.voteStatus || 'none';
  } catch (error) {
    console.error('Error getting vote status:', error);
    return 'none';
  }
};

/**
 * Slaat een vote op voor een comment
 * 
 * @param {string} commentId - ID van het comment
 * @param {string} voteType - Type vote ('up', 'down', of 'none')
 * @returns {Promise} - Promise die resolveert met het resultaat van de API call
 */
export const saveCommentVote = async (commentId, voteType) => {
  try {
    const response = await fetch('/api/comments/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId,
        voteType
      }),
    });

    if (!response.ok) throw new Error('Kon vote niet opslaan');

    const data = await response.json();

    // Dispatch event zodat andere componenten weten dat er een vote is gewijzigd
    window.dispatchEvent(new CustomEvent('commentVoteChanged', {
      detail: { commentId, vote: voteType, newScore: data.voteCount }
    }));

    return data;
  } catch (error) {
    console.error('Error saving vote:', error);
    throw error;
  }
};