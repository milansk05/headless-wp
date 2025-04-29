import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { fetchAPI } from '../lib/api';
import { GET_ALL_POSTS, GET_CATEGORIES } from '../lib/queries';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Head from 'next/head';
import Image from 'next/image';
import { SiteContext } from './_app';
import FeaturedImage from '../components/FeaturedImage';

export default function Home() {
    const { siteSettings } = useContext(SiteContext);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [featuredPost, setFeaturedPost] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch posts en categorieën parallel
                const [postsData, categoriesData] = await Promise.all([
                    fetchAPI(GET_ALL_POSTS),
                    fetchAPI(GET_CATEGORIES)
                ]);

                const allPosts = postsData.posts.nodes;

                // Selecteer het meest recente bericht als uitgelicht bericht
                if (allPosts.length > 0) {
                    setFeaturedPost(allPosts[0]);
                    setPosts(allPosts.slice(1)); // Alle berichten behalve het uitgelichte
                } else {
                    setPosts([]);
                }

                setCategories(categoriesData.categories.nodes);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Er is een fout opgetreden bij het laden van de gegevens.');
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Inhoud wordt geladen...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-red-500 p-4 rounded-lg bg-red-50 border border-red-200 max-w-md">
                    <h2 className="text-xl font-semibold mb-2">Oeps!</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Probeer opnieuw
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{siteSettings.title} - {siteSettings.description}</title>
                <meta name="description" content={siteSettings.description} />
            </Head>

            <main className="flex-grow">
                {/* Hero Sectie */}
                <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{siteSettings.title || 'Mijn Blog'}</h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-8">
                            {siteSettings.description || 'Welkom op mijn persoonlijke blog waar ik mijn gedachten, ervaringen en kennis deel.'}
                        </p>
                        <div className="max-w-md mx-auto">
                            <SearchBar className="bg-white rounded-full shadow-lg" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Uitgelicht Bericht */}
                    {featuredPost && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Uitgelicht Bericht</h2>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="md:flex">
                                    <div className="md:w-1/2">
                                        {featuredPost.featuredImage?.node ? (
                                            <div className="relative w-full h-64 md:h-full">
                                                <FeaturedImage
                                                    featuredImage={featuredPost.featuredImage}
                                                    postTitle={featuredPost.title}
                                                    className="w-full h-full"
                                                    objectFit="cover"
                                                    priority={true}
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-gray-200 w-full h-64 md:h-full flex items-center justify-center">
                                                <span className="text-gray-500">Geen afbeelding beschikbaar</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 md:w-1/2">
                                        <Link href={`/posts/${featuredPost.slug}`}>
                                            <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 transition">
                                                {featuredPost.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {new Date(featuredPost.date).toLocaleDateString('nl-NL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <div
                                            className="text-gray-600 mb-4"
                                            dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }}
                                        />
                                        <Link
                                            href={`/posts/${featuredPost.slug}`}
                                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                        >
                                            Lees verder
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="md:flex md:gap-8">
                        {/* Recente Berichten */}
                        <div className="md:w-2/3 mb-8 md:mb-0">
                            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Recente Berichten</h2>

                            {posts.length > 0 ? (
                                <div className="grid gap-8 md:grid-cols-2">
                                    {posts.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-lg text-center">
                                    <p className="text-gray-600">
                                        Geen posts gevonden. Controleer of je WordPress-installatie posts bevat.
                                    </p>
                                </div>
                            )}

                            {posts.length > 6 && (
                                <div className="text-center mt-8">
                                    <Link
                                        href="/archive"
                                        className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
                                    >
                                        Bekijk alle berichten
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="md:w-1/3">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h3 className="text-xl font-semibold mb-4 pb-2 border-b">Categorieën</h3>

                                {categories.length > 0 ? (
                                    <ul className="space-y-2">
                                        {categories.map(category => (
                                            <li key={category.id}>
                                                <Link
                                                    href={`/category/${category.slug}`}
                                                    className="flex justify-between items-center py-2 text-gray-700 hover:text-blue-600 transition"
                                                >
                                                    <span>{category.name}</span>
                                                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                                                        {category.count}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Geen categorieën gevonden</p>
                                )}
                            </div>

                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3">Over Mij</h3>
                                <p className="text-gray-700 mb-4">
                                    {siteSettings.aboutText || 'Hallo! Ik ben de schrijver achter deze blog. Ik deel hier mijn gedachten, ervaringen en kennis over verschillende onderwerpen.'}
                                </p>
                                <Link
                                    href="/over-mij"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Meer over mij →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Nieuwsbrief Sectie */}
            <Newsletter />

        </div>
    );
}