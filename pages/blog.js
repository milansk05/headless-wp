// pages/blog.js

import { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/api';
import { GET_ALL_POSTS, GET_CATEGORIES } from '../lib/queries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Blog({ initialPosts, categories }) {
    const router = useRouter();
    const [posts] = useState(initialPosts); // Remove unused setPosts
    const [filteredPosts, setFilteredPosts] = useState(initialPosts);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    // Filter en sorteer posts wanneer filters veranderen
    useEffect(() => {
        let result = [...posts];

        // Filter op categorie
        if (activeCategory !== 'all') {
            result = result.filter(post =>
                post.categories?.nodes?.some(category => category.slug === activeCategory)
            );
        }

        // Filter op zoekterm
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(query) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(query))
            );
        }

        // Sorteer resultaten
        result = sortPosts(result, sortOption);

        setFilteredPosts(result);
        setCurrentPage(1); // Reset naar eerste pagina bij filterwijzigingen
    }, [activeCategory, sortOption, searchQuery, posts]);

    // Sorteerfunctie
    const sortPosts = (postsToSort, option) => {
        switch (option) {
            case 'newest':
                return [...postsToSort].sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return [...postsToSort].sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'title-az':
                return [...postsToSort].sort((a, b) => a.title.localeCompare(b.title));
            case 'title-za':
                return [...postsToSort].sort((a, b) => b.title.localeCompare(a.title));
            default:
                return postsToSort;
        }
    };

    // Handle categorie filter
    const handleCategoryChange = (category) => {
        setActiveCategory(category);

        // Update URL query parameter
        router.push({
            pathname: '/blog',
            query: {
                ...(category !== 'all' && { category }),
                ...(sortOption !== 'newest' && { sort: sortOption }),
                ...(searchQuery && { q: searchQuery })
            }
        }, undefined, { shallow: true });
    };

    // Handle sortering
    const handleSortChange = (e) => {
        setSortOption(e.target.value);

        // Update URL query parameter
        router.push({
            pathname: '/blog',
            query: {
                ...(activeCategory !== 'all' && { category: activeCategory }),
                ...(e.target.value !== 'newest' && { sort: e.target.value }),
                ...(searchQuery && { q: searchQuery })
            }
        }, undefined, { shallow: true });
    };

    // Handle zoeken
    const handleSearch = (query) => {
        setSearchQuery(query);

        // Update URL query parameter
        router.push({
            pathname: '/blog',
            query: {
                ...(activeCategory !== 'all' && { category: activeCategory }),
                ...(sortOption !== 'newest' && { sort: sortOption }),
                ...(query && { q: query })
            }
        }, undefined, { shallow: true });
    };

    // Paginering
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // URL synchronisatie bij laden
    useEffect(() => {
        const { category, sort, q } = router.query;

        if (category) setActiveCategory(category);
        if (sort) setSortOption(sort);
        if (q) setSearchQuery(q);
    }, [router.query]);

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Blog | Alle artikelen</title>
                <meta name="description" content="Bekijk alle artikelen en filter op categorie of zoekterm." />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
                    <p className="text-gray-600 mb-8">Bekijk al onze artikelen of filter op categorie en onderwerp.</p>

                    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                        {/* Filters section */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="md:w-1/2">
                                <SearchBar
                                    initialValue={searchQuery}
                                    onSearch={handleSearch}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div>
                                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Categorie
                                    </label>
                                    <select
                                        id="category-filter"
                                        value={activeCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="all">Alle categorieën</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name} ({category.count})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sort-options" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sorteren op
                                    </label>
                                    <select
                                        id="sort-options"
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="newest">Nieuwste eerst</option>
                                        <option value="oldest">Oudste eerst</option>
                                        <option value="title-az">Titel (A-Z)</option>
                                        <option value="title-za">Titel (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Results info */}
                        <div className="text-sm text-gray-600 mb-4">
                            {filteredPosts.length} {filteredPosts.length === 1 ? 'artikel' : 'artikelen'} gevonden
                            {activeCategory !== 'all' && categories.find(c => c.slug === activeCategory) &&
                                ` in categorie "${categories.find(c => c.slug === activeCategory).name}"`
                            }
                            {searchQuery && ` voor "${searchQuery}"`}
                        </div>
                    </div>

                    {/* Posts grid */}
                    {filteredPosts.length > 0 ? (
                        <>
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {currentPosts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            Vorige
                                        </button>

                                        {Array.from({ length: totalPages }).map((_, index) => {
                                            const pageNumber = index + 1;
                                            // Toon maximaal 5 pagina-nummers met huidige pagina in het midden
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1) ||
                                                (currentPage <= 3 && pageNumber <= 5) ||
                                                (currentPage >= totalPages - 2 && pageNumber >= totalPages - 4)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => paginate(pageNumber)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            }

                                            // Toon ellipsis (...) waar nodig
                                            if (
                                                (pageNumber === 2 && currentPage > 3) ||
                                                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                                            ) {
                                                return (
                                                    <span
                                                        key={pageNumber}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }

                                            return null;
                                        })}

                                        <button
                                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            Volgende
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-gray-50 p-12 rounded-lg text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Geen artikelen gevonden</h3>
                            <p className="mt-1 text-gray-500">
                                We konden geen artikelen vinden die voldoen aan je zoekcriteria.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setActiveCategory('all');
                                        setSortOption('newest');
                                        setSearchQuery('');
                                        router.push('/blog', undefined, { shallow: true });
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Wis alle filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export async function getStaticProps() {
    try {
        // Fetch posts en categorieën parallel
        const [postsData, categoriesData] = await Promise.all([
            fetchAPI(GET_ALL_POSTS),
            fetchAPI(GET_CATEGORIES)
        ]);

        return {
            props: {
                initialPosts: postsData.posts.nodes,
                categories: categoriesData.categories.nodes,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: {
                initialPosts: [],
                categories: [],
            },
            revalidate: 10,
        };
    }
}