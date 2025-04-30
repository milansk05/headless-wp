import { useState } from 'react';

const CommentReplyForm = ({ postId, parentId, onReplySubmitted, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
  });
  const [status, setStatus] = useState({
    submitting: false,
    error: null
  });

  // Handle form input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Submit reply
  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ submitting: true, error: null });

    try {
      // Call API to submit reply
      const res = await fetch('/api/comments?action=reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
          parentId: parentId,
          postId: postId
        })
      });

      const data = await res.json();

      if (res.status === 200) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          comment: ''
        });
        
        // Notify parent component
        if (onReplySubmitted) {
          onReplySubmitted();
        }
      } else {
        setStatus({
          submitting: false,
          error: data.message || 'Er is een fout opgetreden bij het plaatsen van je reactie.'
        });
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setStatus({
        submitting: false,
        error: 'Er is een fout opgetreden bij het plaatsen van je reactie.'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h5 className="font-medium text-gray-800 mb-2">Plaats een reactie</h5>
      
      {status.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md">
          <p>{status.error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`name-${parentId}`} className="block text-sm font-medium text-gray-700 mb-1">
            Naam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id={`name-${parentId}`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor={`email-${parentId}`} className="block text-sm font-medium text-gray-700 mb-1">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id={`email-${parentId}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor={`comment-${parentId}`} className="block text-sm font-medium text-gray-700 mb-1">
          Reactie <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`comment-${parentId}`}
          name="comment"
          rows="3"
          value={formData.comment}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={status.submitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {status.submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Versturen...
            </>
          ) : 'Versturen'}
        </button>
      </div>
    </form>
  );
};

export default CommentReplyForm;
