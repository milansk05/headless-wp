import cookie from 'cookie';
import { registerVote } from '../../../mocks/commentApi';

/**
 * Generate or get a unique user identifier
 * @param {Object} req - Request object
 * @returns {string} - Device identifier
 */
function getUserIdentifier(req) {
  // Check if user already has an identifier cookie
  const cookies = cookie.parse(req.headers.cookie || '');
  let userId = cookies.comment_voter_id;

  // If no cookie exists, create a new identifier
  if (!userId) {
    // Use a combination of IP and user agent for anonymous users
    const ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    userId = Buffer.from(`${ip}-${userAgent}-${Date.now()}`).toString('base64');
  }

  return userId;
}

export default async function handler(req, res) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { commentId, voteType } = req.body;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID is vereist'
      });
    }

    if (!['up', 'down', 'none'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Ongeldig stemtype'
      });
    }

    // Get or generate a unique identifier for this user
    const userId = getUserIdentifier(req);

    // Use the mock function to register the vote
    // In a real implementation, this would update your database
    const result = registerVote(commentId, voteType, userId);

    // Set a cookie to remember this user's identity
    res.setHeader('Set-Cookie', cookie.serialize('comment_voter_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'strict',
      path: '/'
    }));

    // Return success response with vote data
    return res.status(200).json({
      success: true,
      message: 'Stem geregistreerd',
      commentId: result.commentId,
      voteType: result.voteType,
      voteCount: result.voteCount
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwerken van je stem',
      error: error.message
    });
  }
}