import { fetchAPI } from '../lib/api';
import { GET_PAGE_BY_SLUG, GET_ALL_PAGES } from '../lib/queries';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContext } from 'react';
import { SiteContext } from './_app';
import Image from 'next/image';

export default function Page({ page }) {
    const { siteSettings } = useContext(SiteContext);

    if (!page) {
        return (
            <div>
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-red-50 p-8 rounded-lg text-center">
                        <h1 className="text-2xl font-bold text-red-700 mb-2">Pagina niet gevonden</h1>
                        <p className="text-gray-600 mb-4">De pagina die je zoekt bestaat niet of is verwijderd.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{page.title} | {siteSettings.title || 'Mijn Blog'}</title>
                <meta name="description" content={page.excerpt || siteSettings.description} />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <article className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6">{page.title}</h1>

                    {page.featuredImage?.node && (
                        <div className="mb-6 relative w-full h-72">
                            <Image
                                src={page.featuredImage.node.sourceUrl}
                                alt={page.featuredImage.node.altText || page.title}
                                className="rounded-lg"
                                fill
                                sizes="(max-width: 768px) 100vw, 800px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    <div
                        className="prose lg:prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
}

export async function getStaticPaths() {
    try {
        const data = await fetchAPI(GET_ALL_PAGES);

        const paths = data.pages.nodes.map((page) => ({
            params: { slug: page.slug },
        }));

        return { paths, fallback: true };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [], fallback: true };
    }
}

export async function getStaticProps({ params }) {
    try {
        const data = await fetchAPI(GET_PAGE_BY_SLUG, {
            variables: { slug: params.slug },
        });

        return {
            props: {
                page: data.page,
            },
            revalidate: 60, // Regenereer pagina na 60 seconden
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: {
                page: null,
            },
            revalidate: 10,
        };
    }
}