import { fetchAPI } from '../../lib/api';
import { GET_CATEGORIES, GET_POSTS_BY_CATEGORY } from '../../lib/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import Head from 'next/head';
import { useContext } from 'react';
import { SiteContext } from '../_app';

export default function Category({ category, posts }) {
    const router = useRouter();
    const { siteSettings } = useContext(SiteContext);

    if (router.isFallback) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Categorie wordt geladen...</p>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div>
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                        &larr; Terug naar home
                    </Link>
                    <div className="bg-red-50 p-8 rounded-lg text-center">
                        <h1 className="text-2xl font-bold text-red-700 mb-2">Categorie niet gevonden</h1>
                        <p className="text-gray-600 mb-4">De categorie die je zoekt bestaat niet of is verwijderd.</p>
                        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                            Terug naar home
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Meta title en description
    const metaTitle = `Categorie: ${category.name} | ${siteSettings.title || 'Mijn Blog'}`;
    const metaDescription = category.description
        ? category.description
        : `Bekijk alle berichten in de categorie ${category.name} op ${siteSettings.title || 'Mijn Blog'}.`;

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    &larr; Terug naar home
                </Link>

                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Categorie: {category.name}</h1>
                    {category.description && (
                        <p className="text-gray-600 max-w-3xl mx-auto mb-4">{category.description}</p>
                    )}
                    <p className="text-gray-600">
                        {posts.length} {posts.length === 1 ? 'bericht' : 'berichten'} in deze categorie
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <p className="text-gray-600">Geen berichten gevonden in deze categorie.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export async function getStaticPaths() {
    try {
        const data = await fetchAPI(GET_CATEGORIES);

        const paths = data.categories.nodes.map((category) => ({
            params: { slug: category.slug },
        }));

        return { paths, fallback: true };
    } catch (error) {
        console.error('Error in getStaticPaths for categories:', error);
        return { paths: [], fallback: true };
    }
}

export async function getStaticProps({ params }) {
    try {
        // Haal eerst alle categorieën op om de huidige categorie te vinden
        const categoriesData = await fetchAPI(GET_CATEGORIES);
        const category = categoriesData.categories.nodes.find(cat => cat.slug === params.slug);

        if (!category) {
            return {
                props: {
                    category: null,
                    posts: [],
                },
                revalidate: 10
            };
        }

        // Haal posts op voor deze categorie
        const postsData = await fetchAPI(GET_POSTS_BY_CATEGORY, {
            variables: { categorySlug: category.slug },
        });

        return {
            props: {
                category,
                posts: postsData.posts.nodes,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error in getStaticProps for category:', error);
        return {
            props: {
                category: null,
                posts: [],
            },
            revalidate: 10,
        };
    }
}