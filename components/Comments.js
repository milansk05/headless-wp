import { useState, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';
import Comment from './Comment';
import { getCommentVotes, formatCommentsWithVotes, sortComments } from '../utils/commentUtils';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('newest');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch comments for this post
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/comments?postId=${postId}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch comments');
                }
                
                const data = await response.json();
                
                // Get user's votes from localStorage
                const votes = getCommentVotes();
                
                // Format comments with vote information
                const enhancedComments = formatCommentsWithVotes(data.comments || [], votes);
                
                // Sort comments
                const sortedComments = sortComments(enhancedComments, sortOption);
                
                setComments(sortedComments);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching comments:', err);
                setError(err.message || 'Er is een fout opgetreden bij het laden van de reacties.');
                setLoading(false);
            }
        };

        if (postId) {
            fetchComments();
        } else {
            setError('Post ID is niet opgegeven. Reacties kunnen niet worden geladen.');
            setLoading(false);
        }
    }, [postId, sortOption, refreshTrigger]);

    // Handle sorting change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Handle comment refreshing
    const refreshComments = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="text-center py-6">
                <LoadingIndicator message="Reacties laden..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-semibold">
                    {comments.length} {comments.length === 1 ? 'Reactie' : 'Reacties'}
                </h3>
                
                {/* Sorting options */}
                {comments.length > 1 && (
                    <div className="flex items-center">
                        <label htmlFor="comment-sort" className="mr-2 text-sm text-gray-600">
                            Sorteren op:
                        </label>
                        <select
                            id="comment-sort"
                            value={sortOption}
                            onChange={handleSortChange}
                            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="newest">Nieuwste eerst</option>
                            <option value="oldest">Oudste eerst</option>
                            <option value="popular">Meest gewaardeerd</option>
                        </select>
                    </div>
                )}
            </div>

            {comments.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center mb-8">
                    <p className="text-gray-600">Nog geen reacties. Wees de eerste die reageert!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <Comment 
                            key={comment.id} 
                            comment={comment} 
                            postId={postId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;