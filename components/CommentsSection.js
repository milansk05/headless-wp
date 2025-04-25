import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import Comments from './Comments';

const CommentsSection = ({ postId }) => {
    const [refreshComments, setRefreshComments] = useState(0);

    // Handle comment submission success
    const handleCommentSubmitted = () => {
        // Increment refresh counter to trigger a re-fetch of comments
        setRefreshComments(prev => prev + 1);
    };

    return (
        <section className="max-w-4xl mx-auto my-12">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Reacties</h2>

            {/* Comments display */}
            <Comments
                postId={postId}
                key={`comments-${refreshComments}`}
            />

            {/* Add some extra space between comments and form */}
            <div className="mt-12 mb-6 border-t border-gray-200"></div>

            {/* Comment form */}
            <CommentForm
                postId={postId}
                onCommentSubmitted={handleCommentSubmitted}
            />
        </section>
    );
};

export default CommentsSection;