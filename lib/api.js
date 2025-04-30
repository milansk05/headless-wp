import { GraphQLClient, gql } from 'graphql-request';

// Definieer de GraphQL API URL
const graphqlAPI = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://headless-wp.local/graphql';

// Debug logging om te helpen bij het identificeren van API-problemen
console.log('GraphQL API URL:', graphqlAPI);

// Creëer een GraphQL client met de juiste headers
const createGraphQLClient = () => {
    return new GraphQLClient(graphqlAPI, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

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

        // Creëer een nieuwe client voor elke aanvraag
        const graphQLClient = createGraphQLClient();

        // Voer de query uit en retourneer het resultaat
        const data = await graphQLClient.request(query, variables);
        return data;
    } catch (error) {
        // Gedetailleerd foutbericht voor makkelijker debuggen
        console.error('Error executing GraphQL query:', error);
        console.error('Query was:', query);
        console.error('Variables were:', variables);
        console.error('API URL was:', graphqlAPI);

        // Specifieke error message voor connectie problemen
        if (error.message.includes('Failed to fetch') ||
            error.message.includes('ENOTFOUND') ||
            error.message.includes('ECONNREFUSED')) {
            console.error('Connection error: Make sure WordPress GraphQL endpoint is accessible');
            error.isConnectionError = true;
        }

        // Gooi de fout door om deze op een hoger niveau te kunnen afhandelen
        throw error;
    }
}

// Update the GET_COMMENTS query to include votes information
export const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    comments(where: { contentId: $postId, orderby: { field: COMMENT_DATE, order: DESC } }) {
      nodes {
        id
        content
        date
        parentId
        author {
          node {
            name
            email
          }
        }
        commentId
        databaseId
        voteScore
        replies {
          nodes {
            id
            content
            date
            parentId
            author {
              node {
                name
                email
              }
            }
            commentId
            databaseId
            voteScore
          }
        }
      }
    }
  }
`;

// Add a mutation for voting on comments
export const VOTE_COMMENT = gql`
  mutation VoteComment($commentId: ID!, $type: String!, $userId: String!) {
    voteComment(input: { commentId: $commentId, type: $type, userId: $userId }) {
      success
      message
      commentId
      voteCount
      userVote
    }
  }
`;

// Add GraphQL query to get user vote status
export const GET_COMMENT_VOTE_STATUS = gql`
  query GetCommentVoteStatus($commentId: ID!, $deviceId: String!) {
    commentVoteStatus(commentId: $commentId, deviceId: $deviceId) {
      status
      message
    }
  }
`;

// Add new mutation to reply to comments
export const REPLY_TO_COMMENT = gql`
  mutation ReplyToComment($commentId: ID!, $postId: ID!, $content: String!, $author: String!, $authorEmail: String!) {
    addComment(input: {
      commentOn: $postId,
      parent: $commentId,
      content: $content,
      author: $author,
      authorEmail: $authorEmail
    }) {
      success
      comment {
        id
        content
        date
        parentId
        author {
          node {
            name
            email
          }
        }
        voteScore
      }
    }
  }
`;