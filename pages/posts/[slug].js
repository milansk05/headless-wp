import { fetchAPI } from '../../lib/api';
import { GET_ALL_POSTS, GET_POST_BY_SLUG } from '../../lib/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Image from 'next/image';

export default function Post({ post }) {
    const router = useRouter();

    // Als de pagina aan het laden is
    if (router.isFallback) {
        return <div>Laden...</div>;
    }

    // Als er geen post is gevonden
    if (!post) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                        &larr; Terug naar overzicht
                    </Link>
                    <h1 className="text-2xl font-bold">Post niet gevonden</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />

            <main className="container mx-auto px-4 py-8">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    &larr; Terug naar overzicht
                </Link>

                <article>
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-500 mb-6">
                        {new Date(post.date).toLocaleDateString()}
                    </p>

                    {post.featuredImage?.node && (
                        <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                            className="w-full max-h-96 object-cover mb-6 rounded-lg"
                        />
                    )}

                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
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

        return {
            props: {
                post: data.post,
            },
            revalidate: 60, // Regenereer pagina na 60 seconden
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: {
                post: null,
            },
            revalidate: 10,
        };
    }
}