import { fetchAPI } from '../lib/api';
import { GET_ALL_POSTS, GET_POST_BY_SLUG, GET_RELATED_POSTS } from '../lib/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Post({ post, relatedPosts = [] }) {
    const router = useRouter();
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        if (post?.date) {
            const date = new Date(post.date);
            setFormattedDate(date.toLocaleDateString('nl-NL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));
        }
    }, [post]);

    // Als de pagina aan het laden is
    if (router.isFallback) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Bericht wordt geladen...</p>
                </div>
            </div>
        );
    }

    // Als er geen post is gevonden
    if (!post) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-16">
                    <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                        &larr; Terug naar overzicht
                    </Link>
                    <div className="bg-red-50 p-8 rounded-lg text-center">
                        <h1 className="text-2xl font-bold text-red-700 mb-2">Bericht niet gevonden</h1>
                        <p className="text-gray-600 mb-4">Het bericht dat je zoekt bestaat niet of is verwijderd.</p>
                        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                            Terug naar home
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    &larr; Terug naar overzicht
                </Link>

                <article className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-10 max-w-4xl mx-auto mb-12">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                        <div className="text-gray-500 mb-4">
                            {formattedDate}
                        </div>
                    </header>

                    {post.featuredImage?.node && (
                        <figure className="mb-8">
                            <Image
                                src={post.featuredImage.node.sourceUrl}
                                alt={post.featuredImage.node.altText || post.title}
                                className="w-full rounded-lg shadow-md"
                            />
                            {post.featuredImage.node.caption && (
                                <figcaption className="text-sm text-gray-500 mt-2 text-center"
                                    dangerouslySetInnerHTML={{ __html: post.featuredImage.node.caption }}
                                />
                            )}
                        </figure>
                    )}

                    <div
                        className="prose lg:prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {post.categories?.nodes?.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                {post.categories.nodes.map(category => (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full transition"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {relatedPosts.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Gerelateerde berichten</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map(relatedPost => (
                                <PostCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Reacties sectie als voorbeeld */}
                <section className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Reacties</h2>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-xl font-medium mb-4">Laat een reactie achter</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Naam
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                    Reactie
                                </label>
                                <textarea
                                    id="comment"
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                            >
                                Plaats reactie
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        {/* Dit zijn voorbeeld reacties - in een echte implementatie zou je deze uit je WordPress API halen */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                            <div className="flex items-center mb-2">
                                <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
                                    JD
                                </div>
                                <div>
                                    <h4 className="font-semibold">Jan Doedel</h4>
                                    <p className="text-sm text-gray-500">2 dagen geleden</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                Geweldig artikel! Bedankt voor het delen van deze inzichten. Ik ben benieuwd hoe dit zich verder gaat ontwikkelen.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export async function getStaticPaths() {
    try {
        const data = await fetchAPI(GET_ALL_POSTS);

        const paths = data.posts.nodes.map((post) => ({
            params: { slug: post.slug },
        }));

        return { paths, fallback: true };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [], fallback: true };
    }
}

export async function getStaticProps({ params }) {
    try {
        const data = await fetchAPI(GET_POST_BY_SLUG, {
            variables: { slug: params.slug },
        });

        // Haal gerelateerde posts op (dit is een voorbeeld, pas aan naar je specifieke query)
        let relatedPosts = [];
        try {
            if (data.post?.categories?.nodes?.[0]?.slug) {
                const categorySlug = data.post.categories.nodes[0].slug;
                const relatedData = await fetchAPI(GET_RELATED_POSTS, {
                    variables: { categorySlug, currentPostId: data.post.id },
                });
                relatedPosts = relatedData.posts.nodes.slice(0, 3);
            }
        } catch (error) {
            console.error('Error fetching related posts:', error);
        }

        return {
            props: {
                post: data.post,
                relatedPosts,
            },
            revalidate: 60, // Regenereer pagina na 60 seconden
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: {
                post: null,
                relatedPosts: [],
            },
            revalidate: 10,
        };
    }
}