import React from 'react';

const PostContent = ({ content }) => {
    return (
        <div
            className="prose prose-lg max-w-none
        prose-headings:font-semibold 
        prose-headings:text-gray-900 
        prose-h1:text-3xl 
        prose-h1:mt-0 
        prose-h1:mb-6 
        prose-h1:font-bold
        prose-h2:text-2xl 
        prose-h2:mt-8 
        prose-h2:mb-4 
        prose-h2:pb-2 
        prose-h2:border-b 
        prose-h2:border-gray-200
        prose-h3:text-xl 
        prose-h3:mt-6 
        prose-h3:mb-3
        prose-p:my-4 
        prose-p:leading-relaxed
        prose-a:text-blue-600 
        prose-a:no-underline 
        hover:prose-a:underline 
        hover:prose-a:text-blue-800
        prose-blockquote:border-l-4 
        prose-blockquote:border-blue-500 
        prose-blockquote:bg-blue-50 
        prose-blockquote:pl-4 
        prose-blockquote:py-2 
        prose-blockquote:italic
        prose-ul:my-4 
        prose-ul:list-disc 
        prose-ul:pl-6
        prose-ol:my-4 
        prose-ol:list-decimal 
        prose-ol:pl-6
        prose-li:my-2"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default PostContent;