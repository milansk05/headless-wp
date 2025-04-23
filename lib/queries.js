export const GET_ALL_POSTS = `
  query AllPosts {
    posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        excerpt
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      slug
      date
      featuredImage {
        node {
          sourceUrl
          altText
          caption
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

export const GET_RELATED_POSTS = `
  query RelatedPosts($categorySlug: String!, $currentPostId: ID!) {
    posts(
      first: 3, 
      where: {
        categoryName: $categorySlug, 
        notIn: [$currentPostId], 
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_MAIN_MENU = `
  query MainMenu {
    menus(first: 1) {
      nodes {
        menuItems {
          nodes {
            id
            label
            path
            url
          }
        }
      }
    }
  }
`;

export const GET_ALL_PAGES = `
  query AllPages {
    pages {
      nodes {
        id
        title
        content
        slug
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = `
  query PageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      content
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_CATEGORIES = `
  query Categories {
    categories(first: 10) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query PostsByCategory($categorySlug: String!) {
    posts(
      first: 20, 
      where: {
        categoryName: $categorySlug, 
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;