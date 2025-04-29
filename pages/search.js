import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI } from '../lib/api';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Breadcrumbs from '../components/Breadcrumbs';
import Head from 'next/head';

// GraphQL query voor zoekresultaten
const SEARCH_QUERY = `
  query SearchPosts($searchTerm: String!) {
    posts(where: {search: $searchTerm}) {
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

export default function Search() {
    const router = useRouter();
    const { q: searchQuery } = router.query;

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { breadcrumb: 'Home', href: '/' }
    ]);

    useEffect(() => {
        // Update breadcrumbs wanneer de zoekterm verandert
        if (searchQuery) {
            setBreadcrumbItems([
                { breadcrumb: 'Home', href: '/' },
                { breadcrumb: 'Zoeken', href: '/search' },
                { breadcrumb: `Resultaten voor: "${searchQuery}"`, href: `/search?q=${searchQuery}` }
            ]);
        } else {
            setBreadcrumbItems([
                { breadcrumb: 'Home', href: '/' },
                { breadcrumb: 'Zoeken', href: '/search' }
            ]);
        }

        if (!searchQuery) {
            setLoading(false);
            return;
        }

        async function performSearch() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchAPI(SEARCH_QUERY, {
                    variables: { searchTerm: searchQuery },
                });

                setSearchResults(data.posts.nodes);
                setLoading(false);
            } catch (err) {
                console.error('Error searching posts:', err);
                setError('Er is een fout opgetreden bij het zoeken.');
                setLoading(false);
            }
        }

        performSearch();
    }, [searchQuery]);

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{searchQuery ? `Zoekresultaten voor: ${searchQuery}` : 'Zoeken'} | Mijn Blog</title>
            </Head>

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Breadcrumbs navigatie */}
                <div className="mb-6">
                    <Breadcrumbs
                        customCrumbs={breadcrumbItems}
                        className="py-2 text-gray-600"
                    />
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6">
                        {searchQuery
                            ? `Zoekresultaten voor: "${searchQuery}"`
                            : 'Zoeken in alle berichten'}
                    </h1>

                    <div className="max-w-lg mb-8">
                        <SearchBar className="mb-2" />
                        <p className="text-sm text-gray-500">
                            Zoek in alle berichten op trefwoord, titel of inhoud.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Zoeken...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-6 rounded-lg text-red-700">
                            <p>{error}</p>
                        </div>
                    ) : !searchQuery ? (
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <p className="text-blue-700">
                                Voer een zoekterm in om berichten te vinden.
                            </p>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                            <h2 className="text-xl font-semibold mb-2">Geen resultaten gevonden</h2>
                            <p className="text-gray-600 mb-4">
                                Geen resultaten gevonden die overeenkomen met &quot;{searchQuery}&quot;.
                            </p>
                            <div className="mt-4">
                                <h3 className="font-medium mb-2">Suggesties:</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    <li>Controleer de spelling van je zoekterm</li>
                                    <li>Probeer andere trefwoorden</li>
                                    <li>Gebruik meer algemene termen</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="mb-6 text-gray-600">
                                {searchResults.length} {searchResults.length === 1 ? 'resultaat' : 'resultaten'} gevonden
                            </p>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {searchResults.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}