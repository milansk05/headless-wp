import { fetchAPI } from '../../lib/api';
import { GET_ALL_POSTS, GET_POST_BY_SLUG, GET_RELATED_POSTS } from '../../lib/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import OptimizedPostCard from '../../components/PostCard';
import { SiteContext } from '../_app';
import Head from 'next/head';
import { formatReadingTime } from '../../utils/readingTime';
import OptimizedPostContent from '../../components/PostContent';
import TableOfContents from '../../components/TableOfContents';
import FloatingTOC from '../../components/FloatingTOC';
import ReadingProgress from '../../components/ReadingProgress';
import CommentsSection from '../../components/CommentsSection';
import BookmarkWidget from '../../components/BookmarkWidget';
import Breadcrumbs from '../../components/Breadcrumbs';
import FeaturedImage from '../../components/FeaturedImage';
import dynamic from 'next/dynamic';

// Dynamisch importeren van ShareButtons voor client-side rendering
const DynamicShareButtons = dynamic(() => import('../../components/ShareButtons'), { ssr: false });

export default function Post({ post, relatedPosts = [] }) {
    const router = useRouter();
    const { siteSettings } = useContext(SiteContext);
    const [formattedDate, setFormattedDate] = useState('');
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    const [contentHtml, setContentHtml] = useState('');
    const [showToc, setShowToc] = useState(false);
    const [readingTime, setReadingTime] = useState('');

    useEffect(() => {
        // Bestaande code voor datum formatteren
        if (post?.date) {
            const date = new Date(post.date);
            setFormattedDate(date.toLocaleDateString('nl-NL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));
        }

        // Nieuwe code voor breadcrumbs
        if (post) {
            setBreadcrumbItems([
                { breadcrumb: 'Home', href: '/' },
                { breadcrumb: 'Blog', href: '/blog' },
                { breadcrumb: post.title, href: `/posts/${post.slug}` }
            ]);

            // Controleer of de post content headings heeft die een inhoudsopgave nodig maken
            if (post.content) {
                setContentHtml(post.content);

                // Maak een tijdelijke div om de content te parsen
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content;

                // Tel het aantal h2 en h3 tags
                const headingsCount = tempDiv.querySelectorAll('h2, h3').length;

                // Toon de inhoudsopgave alleen als er voldoende headings zijn
                setShowToc(headingsCount >= 3);

                // Bereken de leestijd
                try {
                    const readingTimeText = formatReadingTime(post.content);
                    setReadingTime(readingTimeText);
                } catch (error) {
                    console.error('Fout bij het berekenen van de leestijd:', error);
                    setReadingTime('');
                }
            }
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

    // Bereid de URL voor om te delen voor
    const postUrl = `${siteSettings.url || ''}/posts/${post.slug}`;

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

                {/* Artikel specifieke meta tags */}
                <meta property="article:published_time" content={post.date} />
                {post.categories?.nodes?.map((category, index) => (
                    <meta key={index} property="article:section" content={category.name} />
                ))}

                {/* Preload LCP image */}
                {post.featuredImage?.node && (
                    <link
                        rel="preload"
                        as="image"
                        href={post.featuredImage.node.sourceUrl}
                        imageSrcSet={`${post.featuredImage.node.sourceUrl}?w=640 640w, ${post.featuredImage.node.sourceUrl}?w=750 750w, ${post.featuredImage.node.sourceUrl}?w=1080 1080w`}
                        imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 1080px"
                    />
                )}
            </Head>

            {/* Leesvoortgangsbalk */}
            <ReadingProgress
                target="article"
                height={4}
                color="bg-blue-600"
                position="top"
            />

            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Breadcrumbs navigatie */}
                <div className="mb-6">
                    <Breadcrumbs
                        customCrumbs={breadcrumbItems}
                        className="py-2 text-gray-600"
                    />
                </div>

                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    &larr; Terug naar overzicht
                </Link>

                <article className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-10 max-w-4xl mx-auto mb-12">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
                        <div className="text-gray-500 mb-4">
                            {formattedDate}
                        </div>

                        {/* Leestijd */}
                        {readingTime && (
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {readingTime}
                            </div>
                        )}

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

                    {/* Geoptimaliseerde featured image */}
                    {post.featuredImage?.node && (
                        <div className="mb-8">
                            <FeaturedImage
                                featuredImage={post.featuredImage}
                                postTitle={post.title}
                                priority={true}
                                isHero={true}
                                objectFit="cover"
                                className="rounded-lg shadow-md overflow-hidden"
                            />
                        </div>
                    )}

                    {/* BookmarkWidget - added below featured image */}
                    <BookmarkWidget
                        post={post}
                        className="mb-8"
                    />

                    {/* Social share buttons - boven de content */}
                    <DynamicShareButtons
                        url={postUrl}
                        title={post.title}
                        excerpt={post.excerpt}
                    />

                    {/* Inhoudsopgave - toon alleen als er voldoende headings zijn */}
                    {showToc && contentHtml && (
                        <TableOfContents
                            content={contentHtml}
                            enableHighlight={true}
                            headingSelector={['h2', 'h3']}
                            showRelated={true}
                            showActions={true}
                            articleTitle={post.title}
                            articleUrl={postUrl}
                            className="my-6"
                        />
                    )}

                    {/* Geoptimaliseerde post content */}
                    <OptimizedPostContent
                        content={post.content}
                        onContentParsed={(element) => {
                            // Deze callback functie kan gebruikt worden om het element
                            // te analyseren en mogelijk de inhoudsopgave-status bij te werken
                        }}
                    />

                    {/* Social share buttons - onder de content */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <DynamicShareButtons
                            url={postUrl}
                            title={post.title}
                            excerpt={post.excerpt}
                        />
                    </div>

                    {post.author?.node && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center">
                                {post.author.node.avatar?.url ? (
                                    <div className="mr-4 relative w-[60px] h-[60px] rounded-full overflow-hidden">
                                        <FeaturedImage
                                            featuredImage={{
                                                node: {
                                                    sourceUrl: post.author.node.avatar.url,
                                                    altText: post.author.node.name || 'Auteur'
                                                }
                                            }}
                                            width={60}
                                            height={60}
                                            objectFit="cover"
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

                {/* Reacties sectie */}
                <CommentsSection postId={post.databaseId} />

                {/* Gerelateerde berichten met geoptimaliseerde kaarten */}
                {relatedPosts.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Gerelateerde berichten</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((relatedPost, index) => (
                                <OptimizedPostCard
                                    key={relatedPost.id}
                                    post={relatedPost}
                                    showExcerpt={false}
                                    priority={index === 0} // Alleen eerste geladen post prioriteit geven
                                    showBookmarkButton={true}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Floating TOC voor langere artikelen */}
            {showToc && contentHtml && (
                <FloatingTOC
                    content={contentHtml}
                    headingSelector={['h2', 'h3']}
                    position="right"
                />
            )}

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