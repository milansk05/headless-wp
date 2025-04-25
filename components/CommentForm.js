import { useState } from 'react';

const CommentForm = ({ postId, onCommentSubmitted }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: '',
    });
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

        try {
            // API endpoint for submitting comment
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    postId
                })
            });

            const data = await res.json();

            if (res.status === 200) {
                setStatus({
                    submitted: true,
                    submitting: false,
                    info: { error: false, msg: data.message }
                });
                setFormData({
                    name: '',
                    email: '',
                    comment: ''
                });

                // Notify parent component that a comment was submitted
                if (onCommentSubmitted) {
                    onCommentSubmitted();
                }
            } else {
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: true, msg: data.message || 'Er is iets misgegaan. Probeer het later opnieuw.' }
                });
            }
        } catch (error) {
            console.error('Error submitting the comment:', error);
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg: 'Er is iets misgegaan. Controleer je internetverbinding en probeer het later opnieuw.' }
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-6">Laat een reactie achter</h3>

            {status.submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-8 mb-6 text-center">
                    <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-xl font-semibold mb-3">Reactie geplaatst!</h3>
                    <p className="mb-4">{status.info.msg}</p>
                    <button
                        type="button"
                        onClick={() => {
                            setStatus({ submitted: false, submitting: false, info: { error: false, msg: null } });
                            // Trigger the onCommentSubmitted callback to reload comments
                            if (onCommentSubmitted) {
                                onCommentSubmitted();
                            }
                        }}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
                    >
                        Plaats nog een reactie
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {status.info.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                            <p>{status.info.msg}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Naam <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Reactie <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            rows="4"
                            value={formData.comment}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
                    </div>
                    <div className="text-sm text-gray-500">
                        <p>Velden gemarkeerd met een <span className="text-red-500">*</span> zijn verplicht.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={status.submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                        {status.submitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Reactie plaatsen...
                            </>
                        ) : 'Plaats reactie'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommentForm;