import React, { useState, useContext } from 'react';
import { SiteContext } from '../pages/_app';

const Newsletter = () => {
    const { siteSettings } = useContext(SiteContext);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Gebruik de tekst uit WordPress of gebruik een standaardwaarde
    const newsletterTitle = siteSettings.newsletterTitel || 'Blijf op de hoogte';
    const newsletterText = siteSettings.newsletterTekst ||
        'Schrijf je in voor mijn nieuwsbrief om op de hoogte te blijven van nieuwe berichten, tips en exclusieve content.';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setStatus({ success: false, message: 'Vul een e-mailadres in.' });
            return;
        }

        setLoading(true);

        // Hier kun je integratie met je nieuwsbriefsysteem toevoegen
        // Dit is een voorbeeld van hoe het eruit zou kunnen zien
        try {
            // Simuleer een API-aanroep
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulatie van een succesvolle inschrijving
            setStatus({ success: true, message: 'Bedankt voor je inschrijving!' });
            setEmail('');
        } catch {
            setStatus({ success: false, message: 'Er is iets misgegaan. Probeer het later opnieuw.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gradient-to-r from-blue-100 to-indigo-100 py-12">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold mb-2">{newsletterTitle}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                    {newsletterText}
                </p>

                <div className="max-w-md mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Je e-mailadres"
                                className="flex-grow px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Bezig...
                                    </span>
                                ) : 'Inschrijven'}
                            </button>
                        </div>

                        {status && (
                            <div className={`p-3 rounded-lg text-sm ${status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {status.message}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                            We respecteren je privacy en sturen nooit spam. Je kunt je op elk moment uitschrijven.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;