import { fetchAPI } from '../../lib/api';

// GraphQL mutation for adding a comment
const ADD_COMMENT = `
  mutation AddComment($postId: ID!, $content: String!, $author: String!, $authorEmail: String!, $authorUrl: String) {
    createComment(
      input: {
        commentOn: $postId, 
        content: $content, 
        author: $author, 
        authorEmail: $authorEmail,
        authorUrl: $authorUrl
      }
    ) {
      success
      comment {
        id
        content
        date
        author {
          node {
            name
            email
            url
          }
        }
      }
    }
  }
`;

// GraphQL query for getting comments
const GET_COMMENTS = `
  query GetComments($postId: ID!) {
    comments(where: { contentId: $postId, status: APPROVE }) {
      nodes {
        id
        content
        date
        author {
          node {
            name
            email
            url
          }
        }
        parentId
        databaseId
        commentId
        status
      }
    }
  }
`;

// Validate comment data
const validateCommentData = (data) => {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push('Naam is verplicht');
    }

    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.push('Een geldig e-mailadres is verplicht');
    }

    if (!data.comment || data.comment.trim() === '') {
        errors.push('Reactie is verplicht');
    }

    if (!data.postId) {
        errors.push('Post ID is vereist');
    }

    // If website is provided, make sure it's a valid URL
    if (data.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(data.website)) {
        errors.push('Geef een geldige website URL op');
    }

    return errors;
};

// Format the comments
const formatComments = (comments) => {
    if (!comments || !Array.isArray(comments)) {
        console.warn('No valid comments array to format', comments);
        return [];
    }

    // Only include approved comments
    const approvedComments = comments.filter(comment =>
        comment.status === 'APPROVE' || comment.status === 'APPROVED'
    );

    // Format each comment
    const formattedComments = approvedComments.map(comment => {
        return {
            id: comment.id,
            commentId: comment.commentId || comment.databaseId,
            content: comment.content,
            date: comment.date,
            authorName: comment.author?.node?.name || 'Anoniem',
            authorEmail: comment.author?.node?.email || '',
            authorUrl: comment.author?.node?.url || '',
            voteScore: comment.voteScore || 0
        };
    });

    return formattedComments;
};

export default async function handler(req, res) {
    // Handle GET request (get comments)
    if (req.method === 'GET') {
        try {
            const { postId } = req.query;

            if (!postId) {
                return res.status(400).json({ message: 'Post ID is required' });
            }

            // Test if the WordPress API is reachable
            try {
                await fetchAPI(`
                query TestConnection {
                    generalSettings {
                        title
                    }
                }
            `);
            } catch (error) {
                console.error('WordPress API not reachable:', error);

                // Use mock data if WordPress API is not reachable
                if (process.env.NODE_ENV === 'development') {
                    const { getFormattedComments } = await import('../../mocks/commentApi');
                    const comments = getFormattedComments();

                    return res.status(200).json({
                        comments: comments,
                        note: 'Using mock data because WordPress API is not reachable'
                    });
                }

                return res.status(500).json({
                    message: 'Er is een probleem met de verbinding naar WordPress.',
                    error: error.message
                });
            }

            // If WordPress API is reachable, get comments from it
            const data = await fetchAPI(GET_COMMENTS, {
                variables: { postId },
            });

            const formattedComments = formatComments(data.comments?.nodes || []);

            return res.status(200).json({
                comments: formattedComments
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
            return res.status(500).json({
                message: 'Er is een fout opgetreden bij het ophalen van reacties.',
                error: error.message || 'Onbekende fout'
            });
        }
    }

    // Handle POST request (add comment)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, email, comment, website, postId } = req.body;

        // Validate required fields
        if (!name || !email || !comment || !postId) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, comment, and postId are required'
            });
        }

        // Ensure postId is properly formatted
        // WordPress GraphQL might expect a numeric ID
        const numericPostId = parseInt(postId, 10);

        if (isNaN(numericPostId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid post ID format'
            });
        }

        // Call the WordPress GraphQL API to create the comment
        const data = await fetchAPI(ADD_COMMENT, {
            variables: {
                postId: numericPostId,
                content: comment,
                author: name,
                authorEmail: email,
                authorUrl: website || null
            },
        });

        // Check if the comment was successfully created
        if (data.createComment && data.createComment.success) {
            return res.status(200).json({
                success: true,
                message: 'Your comment has been submitted and is awaiting approval.',
                comment: data.createComment.comment
            });
        } else {
            console.error('WordPress comment creation response:', data);
            return res.status(400).json({
                success: false,
                message: 'Failed to submit comment to WordPress'
            });
        }

    } catch (error) {
        console.error('Error submitting comment to WordPress:', error);

        // Provide more specific error messages based on the error
        let errorMessage = 'An error occurred while submitting your comment.';

        if (error.response?.errors?.length > 0) {
            // Extract the specific error message from GraphQL response
            errorMessage = error.response.errors.map(err => err.message).join(', ');
        }

        return res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
}
