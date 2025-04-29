import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Breadcrumbs from '../components/Breadcrumbs';
import useBookmarks from '../hooks/useBookmarks';
import { fetchAPI } from '../lib/api';
import { GET_CATEGORIES } from '../lib/queries';

export default function BookmarksPage() {
    // State for loading categories
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use our custom bookmarks hook
    const {
        filteredBookmarks,
        bookmarkCount,
        filteredCount,
        sorting,
        filter,
        updateSorting,
        updateFilter,
        clearBookmarks,
    } = useBookmarks();

    // Load categories for filter dropdown
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchAPI(GET_CATEGORIES);
                if (data?.categories?.nodes) {
                    setCategories(data.categories.nodes);
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    // Handle search input changes
    const handleSearch = (query) => {
        updateFilter({ searchQuery: query });
    };

    // Handle sort changes
    const handleSortChange = (e) => {
        const value = e.target.value;
        const [sortBy, sortOrder] = value.split('-');
        updateSorting({ sortBy, sortOrder });
    };

    // Handle category filter changes
    const handleCategoryChange = (e) => {
        updateFilter({ category: e.target.value });
    };

    // Handle clear all bookmarks
    const handleClearBookmarks = () => {
        // Show confirmation dialog
        if (window.confirm('Weet je zeker dat je alle favorieten wilt verwijderen?')) {
            clearBookmarks();
        }
    };

    // Generate sort options value
    const getSortValue = () => `${sorting.sortBy}-${sorting.sortOrder}`;

    // Breadcrumb items
    const breadcrumbItems = [
        { breadcrumb: 'Home', href: '/' },
        { breadcrumb: 'Favorieten', href: '/bookmarks' }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Mijn Favorieten</title>
                <meta
                    name="description"
                    content="Bekijk uw opgeslagen favoriete artikelen"
                />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Breadcrumbs */}
                <div className="mb-6">
                    <Breadcrumbs
                        customCrumbs={breadcrumbItems}
                        className="py-2 text-gray-600"
                    />
                </div>

                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Mijn Favorieten</h1>
                    <p className="text-gray-600 mb-8">
                        Bekijk en beheer de artikelen die je hebt opgeslagen voor later.
                    </p>

                    {/* Filter and controls section */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="md:w-1/2">
                                <SearchBar
                                    initialValue={filter.searchQuery}
                                    onSearch={handleSearch}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div>
                                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Categorie
                                    </label>
                                    <select
                                        id="category-filter"
                                        value={filter.category}
                                        onChange={handleCategoryChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="all">Alle categorieën</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name}
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
                                        value={getSortValue()}
                                        onChange={handleSortChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="bookmarkedAt-desc">Nieuwste opgeslagen eerst</option>
                                        <option value="bookmarkedAt-asc">Oudste opgeslagen eerst</option>
                                        <option value="date-desc">Nieuwste publicatie eerst</option>
                                        <option value="date-asc">Oudste publicatie eerst</option>
                                        <option value="title-asc">Titel (A-Z)</option>
                                        <option value="title-desc">Titel (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Bookmark stats and clear button */}
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {bookmarkCount === 0 ? (
                                    <p>Je hebt nog geen favorieten opgeslagen.</p>
                                ) : filteredCount === bookmarkCount ? (
                                    <p>{bookmarkCount} {bookmarkCount === 1 ? 'favoriet' : 'favorieten'} opgeslagen</p>
                                ) : (
                                    <p>{filteredCount} van {bookmarkCount} {bookmarkCount === 1 ? 'favoriet' : 'favorieten'} getoond</p>
                                )}
                            </div>

                            {bookmarkCount > 0 && (
                                <button
                                    onClick={handleClearBookmarks}
                                    className="text-sm text-red-600 hover:text-red-800 hover:underline"
                                >
                                    Verwijder alle favorieten
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bookmarks grid */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Laden...</p>
                        </div>
                    ) : filteredBookmarks.length > 0 ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBookmarks.map(bookmark => (
                                <PostCard
                                    key={bookmark.id}
                                    post={bookmark}
                                    showBookmarkButton={true}
                                />
                            ))}
                        </div>
                    ) : bookmarkCount > 0 ? (
                        <div className="bg-gray-50 p-12 rounded-lg text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Geen favorieten gevonden</h3>
                            <p className="mt-1 text-gray-500">
                                We konden geen favorieten vinden die voldoen aan je zoekcriteria.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        updateFilter({ category: 'all', searchQuery: '' });
                                        updateSorting({ sortBy: 'bookmarkedAt', sortOrder: 'desc' });
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Wis alle filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-12 rounded-lg text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-medium text-gray-900">Nog geen favorieten</h3>
                            <p className="mt-2 text-gray-500 max-w-md mx-auto">
                                Je hebt nog geen artikelen opgeslagen als favoriet. Klik op het bladwijzer icoon bij een artikel om het toe te voegen aan je favorieten.
                            </p>
                            <div className="mt-8">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Bekijk artikelen
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}