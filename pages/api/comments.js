import { fetchAPI } from '../../lib/api';

// GraphQL mutation for adding a comment
const ADD_COMMENT = `
  mutation AddComment($postId: Int!, $content: String!, $author: String!, $authorEmail: String!, $authorUrl: String) {
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
    if (req.method === 'POST') {
        try {
            const { name, email, comment, website, postId } = req.body;

            // Validate form data
            const validationErrors = validateCommentData({
                name,
                email,
                comment,
                postId,
                website
            });

            if (validationErrors.length > 0) {
                return res.status(400).json({
                    message: 'Validatiefout: ' + validationErrors.join(', ')
                });
            }

            // Convert postId to integer for GraphQL API
            const postIdInt = parseInt(postId, 10);

            if (isNaN(postIdInt)) {
                return res.status(400).json({
                    message: 'Post ID moet een geldig getal zijn'
                });
            }

            // Send comment to WordPress
            const data = await fetchAPI(ADD_COMMENT, {
                variables: {
                    postId: postIdInt,
                    content: comment,
                    author: name,
                    authorEmail: email,
                    authorUrl: website || null
                },
            });

            if (data.createComment && data.createComment.success) {
                return res.status(200).json({
                    message: 'Je reactie is succesvol geplaatst en wacht op goedkeuring.',
                    comment: data.createComment.comment
                });
            } else {
                console.error('Comment creation failed but no error was thrown:', data);
                return res.status(400).json({
                    message: 'Er is een fout opgetreden bij het plaatsen van je reactie.',
                    error: 'API returned unsuccessful response'
                });
            }

        } catch (error) {
            console.error('Error submitting comment:', error);

            // If WordPress API is not reachable, simulate success in development
            if (process.env.NODE_ENV === 'development') {
                return res.status(200).json({
                    message: 'Je reactie is succesvol geplaatst en wacht op goedkeuring. (Simulatie omdat WordPress API niet bereikbaar is)',
                });
            }

            // Specific error message for user
            let errorMessage = 'Er is een fout opgetreden bij het verwerken van je reactie. Probeer het later opnieuw.';

            // Check for specific GraphQL errors
            if (error.response?.errors?.length > 0) {
                const graphqlErrors = error.response.errors.map(err => err.message).join(', ');
                console.error('GraphQL errors:', graphqlErrors);

                if (graphqlErrors.includes('commentOn')) {
                    errorMessage = 'Er is een probleem met het artikel ID. Probeer de pagina te vernieuwen.';
                } else if (graphqlErrors.includes('not authorized')) {
                    errorMessage = 'Je hebt geen toestemming om reacties te plaatsen. Mogelijk zijn reacties uitgeschakeld.';
                }
            }

            return res.status(500).json({
                message: errorMessage,
                error: error.message || 'Unknown error'
            });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}