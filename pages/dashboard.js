import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MarketingConsent, FunctionalConsent } from '../components/ConsentConditional';
import useCookieConsent from '../hooks/useCookieConsent';

const Dashboard = () => {
    const {
        COOKIE_CATEGORIES,
        preferences
    } = useCookieConsent();

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Dashboard</title>
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                {/* Functionele features - alleen getoond als er toestemming is */}
                <FunctionalConsent
                    fallback={
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                            <p className="text-yellow-800">
                                Sommige dashboard functies zijn uitgeschakeld omdat je geen toestemming hebt gegeven
                                voor functionele cookies.
                            </p>
                            <button
                                onClick={() => window.openCookieConsentModal?.()}
                                className="mt-2 text-blue-600 hover:underline"
                            >
                                Cookie instellingen aanpassen
                            </button>
                        </div>
                    }
                >
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">Personalisatie Instellingen</h2>
                        <p className="mb-4">Deze functionaliteit maakt gebruik van functionele cookies om je voorkeuren op te slaan.</p>

                        {/* Personalisatie opties hier */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium mb-2">Weergave thema</h3>
                                <select className="w-full p-2 border rounded">
                                    <option>Licht</option>
                                    <option>Donker</option>
                                    <option>Systeem</option>
                                </select>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium mb-2">Taal voorkeur</h3>
                                <select className="w-full p-2 border rounded">
                                    <option>Nederlands</option>
                                    <option>Engels</option>
                                    <option>Frans</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </FunctionalConsent>

                {/* Marketinggerichte content - alleen getoond bij marketing toestemming */}
                <MarketingConsent>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">Aanbevolen voor jou</h2>
                        <p className="mb-4">Deze aanbevelingen worden gegenereerd op basis van je interesses.</p>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Artikel A</h3>
                                <p className="text-sm text-gray-600">Gebaseerd op je interesses</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Artikel B</h3>
                                <p className="text-sm text-gray-600">Populair in jouw regio</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Artikel C</h3>
                                <p className="text-sm text-gray-600">Trending in jouw categorie</p>
                            </div>
                        </div>
                    </div>
                </MarketingConsent>

                {/* Sectie altijd zichtbaar, met daarin voorwaardelijke informatie */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Cookie Instellingen Overzicht</h2>

                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${preferences.necessary ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>Noodzakelijke cookies: <strong>Altijd actief</strong></span>
                        </li>
                        <li className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${preferences.functional ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>Functionele cookies: <strong>{preferences.functional ? 'Actief' : 'Inactief'}</strong></span>
                        </li>
                        <li className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${preferences.analytics ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>Analytische cookies: <strong>{preferences.analytics ? 'Actief' : 'Inactief'}</strong></span>
                        </li>
                        <li className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${preferences.marketing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>Marketing cookies: <strong>{preferences.marketing ? 'Actief' : 'Inactief'}</strong></span>
                        </li>
                    </ul>

                    <button
                        onClick={() => {
                            // Gebruik window.openCookieConsentModal zonder referentie naar updatePreferences
                            if (window.openCookieConsentModal) {
                                window.openCookieConsentModal();
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Cookie instellingen aanpassen
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;