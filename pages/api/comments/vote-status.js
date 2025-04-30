import { GraphQLClient, gql } from 'graphql-request';
import { parse } from 'cookie';

// GraphQL API endpoint
const graphqlAPI = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

// Query om de vote status van een gebruiker voor een comment op te halen
const GET_COMMENT_VOTE_STATUS = gql`
  query GetCommentVoteStatus($commentId: ID!, $deviceId: String!) {
    commentVoteStatus(commentId: $commentId, deviceId: $deviceId) {
      status
      message
    }
  }
`;

/**
 * API route handler voor het ophalen van de vote status van een gebruiker
 */
export default async function handler(req, res) {
    // Alleen GET verzoeken toestaan
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { commentId } = req.query;

        // Check voor vereiste parameter
        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: 'CommentId is vereist'
            });
        }

        // Haal device ID op uit cookies
        let deviceId = null;
        const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};

        if (cookies.deviceId) {
            deviceId = cookies.deviceId;
        } else {
            // Als geen device ID gevonden, dan heeft de gebruiker nog niet gestemd
            return res.status(200).json({
                success: true,
                voteStatus: 'none'
            });
        }

        // GraphQL client voor WordPress
        const graphQLClient = new GraphQLClient(graphqlAPI, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Voer de GraphQL query uit
        const result = await graphQLClient.request(GET_COMMENT_VOTE_STATUS, {
            commentId,
            deviceId
        });

        // Return de vote status
        return res.status(200).json({
            success: true,
            voteStatus: result.commentVoteStatus?.status || 'none'
        });
    } catch (error) {
        console.error('Error in vote status API route:', error);

        return res.status(500).json({
            success: false,
            message: 'Er is een interne serverfout opgetreden.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}