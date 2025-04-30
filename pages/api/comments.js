import { fetchAPI } from '../../lib/api';

// GraphQL mutatie voor het toevoegen van een reactie
const ADD_COMMENT = `
      mutation AddComment($postId: Int!, $content: String!, $author: String!, $authorEmail: String!) {
        createComment(
          input: {
            commentOn: $postId, 
            content: $content, 
            author: $author, 
            authorEmail: $authorEmail
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
              }
            }
          }
        }
      }
    `;

// GraphQL query voor het ophalen van reacties
const GET_COMMENTS = `
      query GetComments($postId: ID!) {
        comments(where: { contentId: $postId }) {
          nodes {
            id
            content
            date
            author {
              node {
                name
                email
              }
            }
            parentId
          }
        }
      }
    `;

// Valideer reactiegegevens
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

    return errors;
};

// Update the formatComments function to simplify it without nested replies
const formatComments = (comments) => {
    if (!comments || !Array.isArray(comments)) {
        console.warn('No valid comments array to format', comments);
        return [];
    }

    // Alleen hoofdcomments selecteren (geen replies)
    const parentComments = comments.filter(comment => !comment.parentId);

    // Formatteer elke comment
    const formattedComments = parentComments.map(comment => {
        return {
            id: comment.id,
            commentId: comment.commentId || comment.databaseId,
            content: comment.content,
            date: comment.date,
            authorName: comment.author?.node?.name || 'Anoniem',
            authorEmail: comment.author?.node?.email || '',
            voteScore: comment.voteScore || 0
        };
    });

    return formattedComments;
};

export default async function handler(req, res) {
    // Behandel GET-verzoek (reacties ophalen)
    if (req.method === 'GET') {
        try {
            const { postId } = req.query;

            if (!postId) {
                return res.status(400).json({ message: 'Post ID is required' });
            }

            // Test of basis WordPress API bereikbaar is voordat we comments ophalen
            try {
                await fetchAPI(`
                query TestConnection {
                    generalSettings {
                        title
                    }
                }
            `);
            } catch (error) {
                console.error('WordPress API niet bereikbaar:', error);
                return res.status(500).json({
                    message: 'Er is een probleem met de verbinding naar WordPress.',
                    error: error.message
                });
            }

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

    // Behandel POST-verzoek (reactie plaatsen)
    if (req.method === 'POST') {
        try {
            const { name, email, comment, postId } = req.body;

            // Valideer formuliergegevens
            const validationErrors = validateCommentData({
                name,
                email,
                comment,
                postId
            });

            if (validationErrors.length > 0) {
                return res.status(400).json({
                    message: 'Validatiefout: ' + validationErrors.join(', ')
                });
            }

            // Zet postId om naar een integer voor de GraphQL API
            const postIdInt = parseInt(postId, 10);

            if (isNaN(postIdInt)) {
                return res.status(400).json({
                    message: 'Post ID moet een geldig getal zijn'
                });
            }

            // Stuur reactie naar WordPress
            const data = await fetchAPI(ADD_COMMENT, {
                variables: {
                    postId: postIdInt,
                    content: comment,
                    author: name,
                    authorEmail: email
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

            // Specifieke error bericht voor gebruiker
            let errorMessage = 'Er is een fout opgetreden bij het verwerken van je reactie. Probeer het later opnieuw.';

            // Controleer op specifieke GraphQL fouten
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

    // Behandel PUT-verzoek (stem op reactie)
    if (req.method === 'PUT') {
        try {
            const { commentId, voteType } = req.body;

            if (!commentId) {
                return res.status(400).json({ message: 'Comment ID is vereist' });
            }

            if (!['up', 'down', 'none'].includes(voteType)) {
                return res.status(400).json({ message: 'Ongeldig stemtype' });
            }

            // Simuleer stemmen in deze demo (normaal zou dit naar WordPress GraphQL gaan)
            // In een echte implementatie zou je de VOTE_COMMENT mutatie gebruiken
            // die we eerder hebben gedefinieerd

            return res.status(200).json({
                success: true,
                message: 'Stem geregistreerd',
                commentId: commentId,
                voteType: voteType,
                // Op een echte backend zou dit de nieuwe stemtelling zijn
                voteScore: voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0
            });
        } catch (error) {
            console.error('Error voting on comment:', error);
            return res.status(500).json({
                message: 'Er is een fout opgetreden bij het stemmen.',
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}