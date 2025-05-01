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

const Comment = ({ comment, postId, onVoteChanged }) => {
    const [voteStatus, setVoteStatus] = useState('none');
    const [voteScore, setVoteScore] = useState(comment.voteScore || 0);
    const [isVoting, setIsVoting] = useState(false);

    // Fetch user's vote status for this comment on component mount
    useEffect(() => {
        const fetchVoteStatus = async () => {
            try {
                const status = await getUserVote(comment.id);
                setVoteStatus(status);
            } catch (error) {
                console.error('Error fetching vote status:', error);
            }
        };

        fetchVoteStatus();
    }, [comment.id]);

    // Update vote status when it changes elsewhere
    useEffect(() => {
        const handleVoteChange = (event) => {
            if (event.detail.commentId === comment.id) {
                setVoteStatus(event.detail.vote);
                setVoteScore(event.detail.newScore);
            }
        };

        window.addEventListener('commentVoteChanged', handleVoteChange);
        return () => window.removeEventListener('commentVoteChanged', handleVoteChange);
    }, [comment.id]);

    // Handle voting
    const handleVote = async (type) => {
        if (isVoting) return;

        // If user clicks the same button again, treat it as removing the vote
        const newVoteType = voteStatus === type ? 'none' : type;
        setIsVoting(true);

        try {
            // Call the API to register the vote
            const response = await fetch('/api/comments/vote', {
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
                // Update local state with the vote count from the server
                setVoteScore(data.voteCount);
                setVoteStatus(data.voteType);

                // Dispatch event to notify other components about the vote change
                window.dispatchEvent(new CustomEvent('commentVoteChanged', {
                    detail: {
                        commentId: comment.id,
                        vote: newVoteType,
                        newScore: data.voteCount
                    }
                }));

                // Call the callback if provided
                if (onVoteChanged) {
                    onVoteChanged(comment.id, newVoteType, data.voteCount);
                }
            } else {
                console.error('Vote failed:', data.message);
            }
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    // Generate an author avatar or use the first letter of their name
    const getAuthorAvatar = () => {
        const firstLetter = comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'A';

        return (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-xl">
                {firstLetter}
            </div>
        );
    };

    // Format the author name with website link if available
    const getAuthorNameDisplay = () => {
        if (comment.authorUrl) {
            return (
                <a
                    href={comment.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-900 hover:text-blue-600 transition"
                >
                    {comment.authorName}
                </a>
            );
        }

        return <span className="font-medium text-gray-900">{comment.authorName}</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start">
                <div className="mr-4 relative w-12 h-12 rounded-full overflow-hidden bg-blue-100">
                    {getAuthorAvatar()}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4>{getAuthorNameDisplay()}</h4>
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
                                className={`flex items-center justify-center p-1 rounded-full transition ${voteStatus === 'up'
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
                                className={`flex items-center justify-center p-1 rounded-full transition ${voteStatus === 'down'
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