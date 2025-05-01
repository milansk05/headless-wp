import { parse } from 'cookie';
import { getVoteStatus } from '../../../mocks/commentApi';

// This is the API route for getting the current vote status of a user for a comment
export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method Not Allowed'
        });
    }

    try {
        const { commentId } = req.query;

        // Check for required parameter
        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: 'CommentId is vereist'
            });
        }

        // Get device ID from cookies
        const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
        const deviceId = cookies.comment_voter_id;

        // If no device ID is found, the user hasn't voted yet
        if (!deviceId) {
            return res.status(200).json({
                success: true,
                voteStatus: 'none'
            });
        }

        // Use the mock function to get the vote status
        // In a real implementation, this would query your database
        const voteStatus = getVoteStatus(commentId, deviceId);

        return res.status(200).json({
            success: true,
            voteStatus: voteStatus
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