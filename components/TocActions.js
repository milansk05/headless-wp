import { useState } from 'react';

/**
 * Component voor acties gerelateerd aan de inhoudsopgave (print, delen, etc.)
 * 
 * @param {Object} props Component properties
 * @param {Array} props.toc Array met inhoudsopgave items
 * @param {string} props.articleTitle Titel van het artikel
 * @param {string} props.articleUrl URL van het artikel
 */
const TocActions = ({ toc, articleTitle, articleUrl }) => {
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Print de inhoudsopgave
    const handlePrint = () => {
        // Maak een printbare versie van de inhoudsopgave
        const printContent = `
      <html>
      <head>
        <title>Inhoudsopgave: ${articleTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 { font-size: 24px; margin-bottom: 20px; }
          h2 { font-size: 18px; margin-top: 30px; margin-bottom: 10px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 10px; }
          .level-3 { padding-left: 20px; }
          .level-4 { padding-left: 40px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Inhoudsopgave: ${articleTitle}</h1>
        <ul>
          ${toc.map(item => `
            <li class="level-${item.level}">
              ${item.text}
            </li>
          `).join('')}
        </ul>
        <div class="footer">
          Bron: <a href="${articleUrl}">${articleUrl}</a>
        </div>
      </body>
      </html>
    `;

        // Open een nieuw venster en print de content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        // Wacht tot de content is geladen en print
        printWindow.onload = function () {
            printWindow.print();
            // Sluit het venster na het printen (afhankelijk van de browser instellingen)
            // printWindow.close();
        };
    };

    // Kopieer de inhoudsopgave naar het klembord
    const handleCopy = () => {
        // Maak een tekst versie van de inhoudsopgave
        const tocText = `
Inhoudsopgave: ${articleTitle}
${toc.map(item => `${' '.repeat((item.level - 2) * 2)}• ${item.text}`).join('\n')}

Bron: ${articleUrl}
    `.trim();

        // Kopieer naar het klembord
        navigator.clipboard.writeText(tocText)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => {
                console.error('Fout bij het kopiëren van tekst: ', err);
            });
    };

    // Toggle het delen popup
    const toggleSharePopup = () => {
        setShowSharePopup(!showSharePopup);
    };

    return (
        <div className="flex items-center justify-end mt-4 text-sm text-gray-500">
            {/* Kopieer knop */}
            <button
                onClick={handleCopy}
                className="flex items-center mr-3 hover:text-blue-600 transition"
                title="Kopieer inhoudsopgave"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {isCopied ? 'Gekopieerd!' : 'Kopiëren'}
            </button>

            {/* Print knop */}
            <button
                onClick={handlePrint}
                className="flex items-center mr-3 hover:text-blue-600 transition"
                title="Print inhoudsopgave"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Printen
            </button>

            {/* Delen knop */}
            <div className="relative">
                <button
                    onClick={toggleSharePopup}
                    className="flex items-center hover:text-blue-600 transition"
                    title="Deel inhoudsopgave"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Delen
                </button>

                {/* Delen popup */}
                {showSharePopup && (
                    <div className="absolute right-0 top-6 mt-2 bg-white rounded-md shadow-lg z-10 w-48">
                        <div className="p-2">
                            <p className="text-xs text-gray-500 mb-2">Deel via:</p>
                            <div className="flex flex-wrap gap-2">
                                {/* Twitter */}
                                <a
                                    href={`https://twitter.com/intent/tweet?text=Inhoudsopgave: ${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 hover:bg-blue-500 text-white"
                                    title="Deel op Twitter"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>

                                {/* Facebook */}
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                                    title="Deel op Facebook"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>

                                {/* LinkedIn */}
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 text-white"
                                    title="Deel op LinkedIn"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>

                                {/* Email */}
                                <a
                                    href={`mailto:?subject=Inhoudsopgave: ${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(`Bekijk de inhoudsopgave van dit artikel:\n\n${articleUrl}`)}`}
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
                                    title="Deel via e-mail"
                                >
                                    <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TocActions;