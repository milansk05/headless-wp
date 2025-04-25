import { useState, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reacties voor dit bericht ophalen
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
                setComments(data.comments || []);
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
    }, [postId]);

    // Datum opmaken voor weergave
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            <h3 className="text-xl font-semibold mb-8">{comments.length} {comments.length === 1 ? 'Reactie' : 'Reacties'}</h3>

            {comments.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center mb-8">
                    <p className="text-gray-600">Nog geen reacties. Wees de eerste die reageert!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start">
                                <div className="mr-4 relative w-12 h-12 rounded-full overflow-hidden bg-blue-100">
                                    {comment.authorName && (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-xl">
                                            {comment.authorName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-medium text-gray-900">{comment.authorName}</h4>
                                        <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                                    </div>
                                    <div className="prose prose-sm max-w-none text-gray-700" 
                                        dangerouslySetInnerHTML={{ __html: comment.content }} />
                                    
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-6 pl-4 border-l-2 border-blue-100 space-y-4">
                                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                                                {comment.replies.length} {comment.replies.length === 1 ? 'antwoord' : 'antwoorden'}
                                            </h4>
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-start">
                                                        <div className="mr-3 relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-sm">
                                                                {reply.authorName.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h5 className="font-medium text-gray-900">{reply.authorName}</h5>
                                                                <span className="text-xs text-gray-500">{formatDate(reply.date)}</span>
                                                            </div>
                                                            <div className="prose prose-sm max-w-none text-gray-700" 
                                                                dangerouslySetInnerHTML={{ __html: reply.content }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;