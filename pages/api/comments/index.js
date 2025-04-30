/**
 * API route handler voor comments
 * Tijdelijke mock-versie om te gebruiken terwijl de WordPress verbinding wordt gerepareerd
 */
export default async function handler(req, res) {
    // Log voor debugging
    console.log('Comments API route aangeroepen', {
        method: req.method,
        query: req.query,
        headers: req.headers,
    });

    // GET verzoek voor het ophalen van comments
    if (req.method === 'GET') {
        try {
            const { postId } = req.query;
            console.log('GET Comments voor postId:', postId);

            if (!postId) {
                console.log('Geen postId opgegeven');
                return res.status(400).json({
                    success: false,
                    message: 'PostId parameter is vereist'
                });
            }

            // Import de mock pas hier om het laden van de pagina te versnellen
            // en server-side problemen te voorkomen
            const { getFormattedComments } = await import('../../../mocks/commentApi');

            // Gebruik de mock functie om comments op te halen
            const comments = getFormattedComments();
            console.log(`${comments.length} comments opgehaald via mock`);

            return res.status(200).json({
                success: true,
                comments: comments
            });
        } catch (error) {
            console.error('Error in comments (GET) API route:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Er is een fout opgetreden bij het ophalen van de comments.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    } 
    // POST verzoek voor het toevoegen van een comment
    else if (req.method === 'POST') {
        try {
            const { name, email, comment, postId } = req.body;
            console.log('POST comment voor postId:', postId);

            // Validatie van vereiste velden
            if (!name || !email || !comment || !postId) {
                return res.status(400).json({
                    success: false,
                    message: 'Naam, e-mail, reactie en postId zijn vereist.'
                });
            }

            // Import de mock pas hier om het laden van de pagina te versnellen
            const { addComment } = await import('../../../mocks/commentApi');

            // Gebruik de mock functie om een comment toe te voegen
            const result = addComment(postId, name, email, comment);
            console.log('Comment toegevoegd, resultaat:', result);

            return res.status(200).json({
                success: true,
                message: 'Reactie succesvol geplaatst!',
                comment: result.comment
            });
        } catch (error) {
            console.error('Error in comments (POST) API route:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Er is een fout opgetreden bij het plaatsen van je reactie.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    // Andere methoden zijn niet toegestaan
    else {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}