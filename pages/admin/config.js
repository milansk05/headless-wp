import Head from 'next/head';
import Footer from '../../components/Footer';
import ConfigDebug from '../../components/ConfigDebug';

const ConfigPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>API Configuratie | Headless WordPress</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">API Configuratie</h1>

                    <div className="mb-8 bg-blue-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">WordPress API Debug</h2>
                        <p className="text-gray-700">
                            Op deze pagina kun je controleren of je WordPress GraphQL API correct is geconfigureerd en bereikbaar is.
                            Dit is essentieel voor het correct functioneren van reacties, contactformulieren en andere dynamische functionaliteiten.
                        </p>
                    </div>

                    <ConfigDebug />

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">Implementatie van Reacties</h2>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="font-medium text-lg mb-3">WordPress Configuratie</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                <li>Zorg dat reacties zijn ingeschakeld in je WordPress instellingen (Instellingen -- Discussie)</li>
                                <li>Installeer en activeer de WPGraphQL plugin (en WPGraphQL for ACF als je ACF gebruikt)</li>
                                <li>Configureer de GraphQL-instellingen om toegang tot reacties toe te staan</li>
                                <li>Configureer CORS-headers in WordPress om requests van je frontend toe te staan</li>
                            </ol>

                            <h3 className="font-medium text-lg mt-6 mb-3">Environment Variabelen</h3>
                            <p className="text-gray-700 mb-2">
                                Maak een <code className="bg-gray-100 text-sm p-1 rounded">.env.local</code> bestand aan in de root van je project met:
                            </p>
                            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                NEXT_PUBLIC_WORDPRESS_API_URL=https://jouw-wordpress-site.nl/graphql
                            </pre>

                            <h3 className="font-medium text-lg mt-6 mb-3">Test de API Verbinding</h3>
                            <p className="text-gray-700">
                                Gebruik de bovenstaande debug tool om te controleren of je API correct is geconfigureerd en bereikbaar is.
                                Als de test slaagt, zouden reacties en andere dynamische inhoud correct moeten werken.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default ConfigPage;