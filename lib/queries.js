// Query om de algemene WordPress instellingen op te halen
export const GET_SITE_SETTINGS = `
  query SiteSettings {
    generalSettings {
      title
      description
      url
    }
  }
`;

// Query om de aangepaste velden van de Site Instellingen pagina op te halen
export const GET_SITE_OPTIONS = `
  query SiteOptions {
    page(id: "over-mij", idType: URI) {
      title
      siteSettings {
        contactEmail
        contactTelefoon
        contactAdres
        twitterUrl
        socialFacebook
        instagramUrl
        socialLinkedin
        footerText
        newsletterTitel
        newsletterTekst
        copyrightText
      }
    }
  }
`;

// Query om alle posts op te halen
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

// Query om een specifieke post op te halen via de slug
export const GET_POST_BY_SLUG = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
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
          description
          avatar {
            url
          }
        }
      }
    }
  }
`;

// Query om gerelateerde posts op te halen
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

// Query om alle categorieën op te halen
export const GET_CATEGORIES = `
  query Categories {
    categories(first: 10) {
      nodes {
        id
        name
        slug
        description
        count
      }
    }
  }
`;

// Query om posts op te halen voor een specifieke categorie
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

// Query om alle pagina's op te halen
export const GET_ALL_PAGES = `
  query AllPages {
    pages {
      nodes {
        id
        title
        slug
      }
    }
  }
`;

// Query om een pagina op te halen via de slug
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
