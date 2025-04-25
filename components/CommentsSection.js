import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import Comments from './Comments';

const CommentsSection = ({ postId }) => {
    const [refreshComments, setRefreshComments] = useState(0);

    // Behandel het succes van het indienen van reacties
    const handleCommentSubmitted = () => {
        // Incrementele vernieuwingsteller om een ​​herhaling van opmerkingen te activeren
        setRefreshComments(prev => prev + 1);
    };

    return (
        <section className="max-w-4xl mx-auto my-12">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Reacties</h2>

            {/* Weergave van reacties */}
            <Comments
                postId={postId}
                key={`comments-${refreshComments}`}
            />

            {/* Voeg wat extra ruimte toe tussen reacties en het formulier */}
            <div className="mt-12 mb-6 border-t border-gray-200"></div>

            {/* Reactieformulier */}
            <CommentForm
                postId={postId}
                onCommentSubmitted={handleCommentSubmitted}
            />
        </section>
    );
};

export default CommentsSection;