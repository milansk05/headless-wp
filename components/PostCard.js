import Link from 'next/link';
import FeaturedImage from './FeaturedImage';

/**
 * OptimizedPostCard - Verbeterde versie van PostCard component met geoptimaliseerde afbeeldingen
 * 
 * @param {Object} props
 * @param {Object} props.post - WordPress post object
 * @param {boolean} props.priority - Of deze kaart prioriteit heeft voor LCP
 * @param {string} props.className - Extra CSS klassen
 * @param {number} props.imageHeight - Vaste hoogte voor de afbeelding
 * @param {boolean} props.showExcerpt - Toon post excerpt
 * @param {boolean} props.showCategories - Toon post categorieën
 * @param {boolean} props.showReadMore - Toon 'Lees verder' knop
 * @param {number} props.excerptLength - Maximale lengte van het excerpt
 */
const OptimizedPostCard = ({
    post,
    priority = false,
    className = '',
    imageHeight = 200,
    showExcerpt = true,
    showCategories = true,
    showReadMore = true,
    excerptLength = 120
}) => {
    // Formatteer de datum
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Beperk de lengte van het uittreksel om te lange voorvertoningen te voorkomen
    const truncateExcerpt = (excerpt, maxLength = excerptLength) => {
        // Verwijder HTML-tags
        const plainText = excerpt.replace(/<[^>]+>/g, '');

        if (plainText.length <= maxLength) return plainText;

        // Vind de laatste spatie voor maxLength
        const truncated = plainText.substr(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');

        return truncated.substr(0, lastSpace) + '...';
    };

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
            <Link href={`/posts/${post.slug}`}>
                <div className="relative h-48 overflow-hidden">
                    <FeaturedImage
                        featuredImage={post.featuredImage}
                        postTitle={post.title}
                        height={imageHeight}
                        containerClass="col-12"
                        linkToPost={false}
                        priority={priority}
                        className="w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </Link>

            <div className="p-5">
                {showCategories && post.categories?.nodes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {post.categories.nodes.slice(0, 2).map(category => (
                            <Link
                                href={`/category/${category.slug}`}
                                key={category.id}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition"
                            >
                                {category.name}
                            </Link>
                        ))}

                        {/* Als er meer dan 2 categorieën zijn, toon het aantal extra */}
                        {post.categories.nodes.length > 2 && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                +{post.categories.nodes.length - 2} meer
                            </span>
                        )}
                    </div>
                )}

                <p className="text-sm text-gray-500 mb-2">
                    {formatDate(post.date)}
                </p>

                <Link href={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition">
                        {post.title}
                    </h3>
                </Link>

                {showExcerpt && (
                    <div className="text-gray-600 mb-4">
                        {post.excerpt ? (
                            <p>{truncateExcerpt(post.excerpt)}</p>
                        ) : (
                            <p>Klik om het volledige bericht te lezen.</p>
                        )}
                    </div>
                )}

                {showReadMore && (
                    <Link
                        href={`/posts/${post.slug}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
                    >
                        Lees verder
                    </Link>
                )}
            </div>
        </div>
    );
};

export default OptimizedPostCard;