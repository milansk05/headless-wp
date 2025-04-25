// lib/api.js - GraphQL API client

import { GraphQLClient } from 'graphql-request';

// Definieer de GraphQL API URL
// Eerst proberen we de environment variabele, anders een fallback URL
const graphqlAPI = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://headless-wp.local/graphql';

// Debug logging om te helpen bij het identificeren van API-problemen
console.log('GraphQL API URL:', graphqlAPI);

// Creëer een GraphQL client met de juiste headers
const graphQLClient = new GraphQLClient(graphqlAPI, {
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Functie om GraphQL queries uit te voeren naar de WordPress API
 * 
 * @param {string} query - De GraphQL query string
 * @param {Object} variables - Optionele variabelen voor de query
 * @returns {Promise<Object>} - De response data
 */
export async function fetchAPI(query, { variables } = {}) {
    try {
        // Log informatie voor debug doeleinden
        console.log(`Executing GraphQL query: ${query.split('{')[0].trim()}`);

        // Voer de query uit en retourneer het resultaat
        const data = await graphQLClient.request(query, variables);
        return data;
    } catch (error) {
        // Gedetailleerd foutbericht voor makkelijker debuggen
        console.error('Error executing GraphQL query:', error);
        console.error('Query was:', query);
        console.error('Variables were:', variables);

        // Gooi de fout door om deze op een hoger niveau te kunnen afhandelen
        throw error;
    }
}