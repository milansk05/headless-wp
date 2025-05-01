import { GraphQLClient, gql } from 'graphql-request';

// Define the GraphQL API URL
const graphqlAPI = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://headless-wp.local/graphql';

// Debug logging to help identify API problems
console.log('GraphQL API URL:', graphqlAPI);

// Create a GraphQL client with the appropriate headers
const createGraphQLClient = () => {
  return new GraphQLClient(graphqlAPI, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Function to execute GraphQL queries against the WordPress API
 * 
 * @param {string} query - The GraphQL query string
 * @param {Object} variables - Optional variables for the query
 * @returns {Promise<Object>} - The response data
 */
export async function fetchAPI(query, { variables } = {}) {
  try {
    // Log information for debugging purposes
    console.log(`Executing GraphQL query: ${query.split('{')[0].trim()}`);

    // Create a new client for each request
    const graphQLClient = createGraphQLClient();

    // Execute the query and return the result
    const data = await graphQLClient.request(query, variables);
    return data;
  } catch (error) {
    // Detailed error message for easier debugging
    console.error('Error executing GraphQL query:', error);

    // Additional diagnostics
    if (error.response?.errors) {
      console.error('GraphQL response errors:', error.response.errors);
    }

    if (error.request) {
      console.error('GraphQL request that failed:', error.request);
    }

    // Specific error message for connection problems
    if (error.message.includes('Failed to fetch') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED')) {
      console.error('Connection error: Make sure WordPress GraphQL endpoint is accessible');
      error.isConnectionError = true;
    }

    // Throw the error for handling at a higher level
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