import { fetchAPI } from '../../../lib/api';
import { VOTE_COMMENT } from '../../../lib/api';
import cookie from 'cookie';

// GraphQL API endpoint
const API_URL = process.env.WORDPRESS_API_URL || 'https://example.com/graphql';

// Generate or get a unique user identifier
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
      return res.status(400).json({ message: 'Comment ID is vereist' });
    }

    if (!['up', 'down', 'none'].includes(voteType)) {
      return res.status(400).json({ message: 'Ongeldig stemtype' });
    }

    // Get or generate a unique identifier for this user
    const userId = getUserIdentifier(req);

    try {
      // Call WordPress GraphQL API to register the vote
      const data = await fetchAPI(VOTE_COMMENT, {
        variables: {
          commentId,
          type: voteType,
          userId
        }
      });

      // Set a cookie to remember this user's identity
      res.setHeader('Set-Cookie', cookie.serialize('comment_voter_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'strict',
        path: '/'
      }));

      // Return success response with vote data
      if (data.voteComment) {
        return res.status(200).json({
          success: true,
          message: 'Stem geregistreerd',
          commentId: data.voteComment.commentId,
          voteType: data.voteComment.userVote,
          voteCount: data.voteComment.voteCount
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Er is een fout opgetreden bij het registreren van je stem'
        });
      }
    } catch (error) {
      console.error('GraphQL error:', error);
      
      // For development/demo purposes - simulate a successful vote without the API
      if (process.env.NODE_ENV !== 'production') {
        // Set cookie even in development mode
        res.setHeader('Set-Cookie', cookie.serialize('comment_voter_id', userId, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 365, // 1 year
          sameSite: 'strict',
          path: '/'
        }));
        
        // Simulate a vote response
        return res.status(200).json({
          success: true,
          message: 'Stem geregistreerd (demo-modus)',
          commentId,
          voteType,
          voteCount: voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het communiceren met de WordPress API',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwerken van je verzoek',
      error: error.message
    });
  }
}