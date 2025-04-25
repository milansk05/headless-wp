export default async function handler(req, res) {
    // Verzamel debug-informatie
    const debugInfo = {
        wordpress_api_url: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'Niet ingesteld',
        node_env: process.env.NODE_ENV,
        api_reachable: false,
        api_response: null,
        error: null
    };

    // Test de API-verbinding
    try {
        const graphqlAPI = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://headless-wp.local/graphql';

        const response = await fetch(graphqlAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
            query TestConnection {
              generalSettings {
                title
              }
            }
          `
            }),
        });

        const data = await response.json();

        debugInfo.api_reachable = response.ok;
        debugInfo.api_response = data;
    } catch (error) {
        debugInfo.error = error.message;
    }

    // Stuur debuggegevens terug
    res.status(200).json(debugInfo);
}