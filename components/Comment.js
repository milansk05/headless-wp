import { useState, useEffect } from 'react';
import { saveCommentVote, getUserVote } from '../utils/commentUtils';

// Format date for display
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

const Comment = ({ comment, postId }) => {
    const [voteStatus, setVoteStatus] = useState(() => getUserVote(comment.id));
    const [voteScore, setVoteScore] = useState(comment.voteScore || 0);
    const [isVoting, setIsVoting] = useState(false);

    // Update vote status when it changes elsewhere
    useEffect(() => {
        const handleVoteChange = (event) => {
            if (comment.id === event.detail.commentId) {
                setVoteStatus(event.detail.vote);
            }
        };

        window.addEventListener('commentVoteChanged', handleVoteChange);
        return () => window.removeEventListener('commentVoteChanged', handleVoteChange);
    }, [comment.id]);

    // Handle voting
    const handleVote = async (type) => {
        if (isVoting) return;

        const newVoteType = voteStatus === type ? 'none' : type;
        setIsVoting(true);

        try {
            // Call API to register vote
            const response = await fetch('/api/comments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commentId: comment.id,
                    voteType: newVoteType
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Calculate new vote score
                let scoreDelta = 0;
                if (newVoteType === 'up') scoreDelta = voteStatus === 'down' ? 2 : 1;
                else if (newVoteType === 'down') scoreDelta = voteStatus === 'up' ? -2 : -1;
                else if (newVoteType === 'none') scoreDelta = voteStatus === 'up' ? -1 : 1;

                // Update local state
                setVoteScore(prevScore => prevScore + scoreDelta);
                setVoteStatus(newVoteType);

                // Save vote to localStorage
                saveCommentVote(comment.id, newVoteType);
            }
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start">
                <div className="mr-4 relative w-12 h-12 rounded-full overflow-hidden bg-blue-100">
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-xl">
                        {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{comment.authorName}</h4>
                        <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                    </div>

                    <div
                        className="prose prose-sm max-w-none text-gray-700 mb-3"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                    />

                    <div className="flex items-center space-x-4 mt-4">
                        {/* Voting buttons */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleVote('up')}
                                disabled={isVoting}
                                className={`flex items-center justify-center p-1 rounded-full ${voteStatus === 'up'
                                    ? 'bg-green-100 text-green-600'
                                    : 'text-gray-400 hover:text-green-600'
                                    }`}
                                title="Deze reactie waarderen"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <span className={`text-sm font-medium ${voteScore > 0 ? 'text-green-600' :
                                voteScore < 0 ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                {voteScore}
                            </span>

                            <button
                                onClick={() => handleVote('down')}
                                disabled={isVoting}
                                className={`flex items-center justify-center p-1 rounded-full ${voteStatus === 'down'
                                    ? 'bg-red-100 text-red-600'
                                    : 'text-gray-400 hover:text-red-600'
                                    }`}
                                title="Deze reactie niet waarderen"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comment;
