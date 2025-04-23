import { GraphQLClient } from 'graphql-request';

// Debug logging
const graphqlAPI = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
console.log('GraphQL API URL:', graphqlAPI); // Debug log

// Fallback naar een hardgecodeerde URL als de env var leeg is
const apiUrl = graphqlAPI || 'http://headless-wp.local/graphql';

const graphQLClient = new GraphQLClient(apiUrl, {
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function fetchAPI(query, { variables } = {}) {
    try {
        console.log('Attempting to fetch from:', apiUrl); // Debug log
        return await graphQLClient.request(query, variables);
    } catch (error) {
        console.error('Error while fetching API:', error);
        throw error;
    }
}