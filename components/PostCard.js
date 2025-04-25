import Link from 'next/link';
import Image from 'next/image';

const PostCard = ({ post }) => {
    // Format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Truncate excerpt text to avoid too long previews
    const truncateExcerpt = (excerpt, maxLength = 120) => {
        // Remove HTML tags
        const plainText = excerpt.replace(/<[^>]+>/g, '');

        if (plainText.length <= maxLength) return plainText;

        // Find the last space before maxLength
        const truncated = plainText.substr(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');

        return truncated.substr(0, lastSpace) + '...';
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/posts/${post.slug}`}>
                <div className="h-48 overflow-hidden relative">
                    {post.featuredImage?.node ? (
                        <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-gray-500">Geen afbeelding</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-5">
                {post.categories?.nodes?.length > 0 && (
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

                <div className="text-gray-600 mb-4">
                    {post.excerpt ? (
                        <p>{truncateExcerpt(post.excerpt)}</p>
                    ) : (
                        <p>Klik om het volledige bericht te lezen.</p>
                    )}
                </div>

                <Link
                    href={`/posts/${post.slug}`}
                    className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                    Lees verder →
                </Link>
            </div>
        </div>
    );
};

export default PostCard;