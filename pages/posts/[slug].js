import { fetchAPI } from '../../lib/api';
import { GET_ALL_POSTS, GET_POST_BY_SLUG, GET_RELATED_POSTS } from '../../lib/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import { SiteContext } from '../_app';
import Head from 'next/head';
import PostContent from '../../components/PostContent';
import CommentsSection from '../../components/CommentsSection';

export default function Post({ post, relatedPosts = [] }) {
    const router = useRouter();
    const { siteSettings } = useContext(SiteContext);
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

    // Meta titel en beschrijving voor SEO
    const metaTitle = `${post.title} | ${siteSettings.title || 'Mijn Blog'}`;
    const metaDescription = post.excerpt
        ? post.excerpt.replace(/<[^>]+>/g, '').substring(0, 160)
        : `Lees het artikel ${post.title} op ${siteSettings.title || 'Mijn Blog'}.`;

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />

                {/* Open Graph tags */}
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`${siteSettings.url}/posts/${post.slug}`} />
                {post.featuredImage?.node && (
                    <meta property="og:image" content={post.featuredImage.node.sourceUrl} />
                )}

                {/* Article specific meta tags */}
                <meta property="article:published_time" content={post.date} />
                {post.categories?.nodes?.map((category, index) => (
                    <meta key={index} property="article:section" content={category.name} />
                ))}
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    &larr; Terug naar overzicht
                </Link>

                <article className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-10 max-w-4xl mx-auto mb-12">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
                        <div className="text-gray-500 mb-4">
                            {formattedDate}
                        </div>

                        {post.categories?.nodes?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.categories.nodes.map(category => (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full transition"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </header>

                    {post.featuredImage?.node && (
                        <figure className="mb-8">
                            <div className="relative w-full h-[400px] md:h-[500px]">
                                <Image
                                    src={post.featuredImage.node.sourceUrl}
                                    alt={post.featuredImage.node.altText || post.title}
                                    fill
                                    className="object-cover rounded-lg shadow-md"
                                    priority={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                                />
                            </div>
                            {post.featuredImage.node.caption && (
                                <figcaption className="text-sm text-gray-500 mt-2 text-center"
                                    dangerouslySetInnerHTML={{ __html: post.featuredImage.node.caption }}
                                />
                            )}
                        </figure>
                    )}

                    <PostContent content={post.content} />

                    {post.author?.node && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center">
                                {post.author.node.avatar?.url ? (
                                    <div className="mr-4 relative w-[60px] h-[60px]">
                                        <Image
                                            src={post.author.node.avatar.url}
                                            alt={post.author.node.name || 'Auteur'}
                                            width={60}
                                            height={60}
                                            className="rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="mr-4 w-[60px] h-[60px] bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-800 font-bold text-xl">
                                            {post.author.node.name?.charAt(0) || 'A'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium text-lg">Geschreven door {post.author.node.name}</h3>
                                    {post.author.node.description && (
                                        <p className="text-gray-600 text-sm">{post.author.node.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </article>

                {/* Comments Section */}
                <CommentsSection postId={post.databaseId} />

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

        // Haal gerelateerde posts op
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