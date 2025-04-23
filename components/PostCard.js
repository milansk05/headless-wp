import Link from 'next/link';
import Image from 'next/image';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/posts/${post.slug}`}>
                <div className="h-48 overflow-hidden">
                    {post.featuredImage?.node ? (
                        <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                            <span className="text-gray-500">Geen afbeelding</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-5">
                <p className="text-sm text-gray-500 mb-2">
                    {new Date(post.date).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
                <Link href={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition">
                        {post.title}
                    </h3>
                </Link>
                <div
                    className="text-gray-600 mb-4"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
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