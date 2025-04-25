import { useState, useEffect } from 'react';

const ConfigDebug = () => {
    const [debug, setDebug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testUrl, setTestUrl] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        const fetchDebugInfo = async () => {
            try {
                const response = await fetch('/api/debug');
                if (!response.ok) {
                    throw new Error('Failed to fetch debug information');
                }
                const data = await response.json();
                setDebug(data);
                setTestUrl(data.wordpress_api_url);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDebugInfo();
    }, []);

    const testEndpoint = async () => {
        setTesting(true);
        setTestResult(null);

        try {
            const response = await fetch(testUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                        query TestConnection {
                            generalSettings {
                                title
                            }
                        }
                    `
                })
            });

            const data = await response.json();

            setTestResult({
                success: response.ok,
                status: response.status,
                data
            });
        } catch (err) {
            setTestResult({
                success: false,
                error: err.message
            });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return <div className="p-4 bg-blue-50 rounded-lg">Configuratie laden...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-50 rounded-lg">Error: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API Configuratie Debug</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="font-medium text-gray-700">Environment Variables:</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p>
                            <span className="font-mono text-sm">NEXT_PUBLIC_WORDPRESS_API_URL:</span>{' '}
                            <span className={debug.wordpress_api_url ? 'text-green-600' : 'text-red-600'}>
                                {debug.wordpress_api_url || 'Niet ingesteld'}
                            </span>
                        </p>
                        <p>
                            <span className="font-mono text-sm">NODE_ENV:</span>{' '}
                            <span className="text-gray-600">{debug.node_env}</span>
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-gray-700">API Connection Test:</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="mb-2">
                            <span className="font-medium">Endpoint bereikbaar:</span>{' '}
                            {debug.api_reachable ? (
                                <span className="text-green-600">Ja</span>
                            ) : (
                                <span className="text-red-600">Nee</span>
                            )}
                        </p>
                        {debug.error && (
                            <p className="text-red-600 text-sm font-mono whitespace-pre-wrap break-words">
                                Fout: {debug.error}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-gray-700">Test GraphQL Endpoint:</h3>
                    <div className="mt-2">
                        <input
                            type="text"
                            value={testUrl}
                            onChange={(e) => setTestUrl(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            placeholder="GraphQL API URL"
                        />
                        <button
                            onClick={testEndpoint}
                            disabled={testing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                        >
                            {testing ? 'Testen...' : 'Test Endpoint'}
                        </button>
                    </div>

                    {testResult && (
                        <div className={`mt-2 p-3 rounded-md ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                            <p className="font-medium">
                                {testResult.success ? 'Verbinding succesvol!' : 'Verbinding mislukt'}
                            </p>
                            {testResult.error && <p className="text-red-600 text-sm">Fout: {testResult.error}</p>}
                            {testResult.data && (
                                <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-x-auto rounded">
                                    {JSON.stringify(testResult.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium text-gray-700">Mogelijke oplossingen:</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                        <li>
                            Zorg dat je <code className="bg-gray-100 text-sm p-1 rounded">.env.local</code> bestand correct is ingesteld:
                            <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
                                NEXT_PUBLIC_WORDPRESS_API_URL=https://jouw-wordpress-site.nl/graphql
                            </pre>
                        </li>
                        <li>
                            Controleer of je WordPress GraphQL-plugin correct is geconfigureerd en actief is
                        </li>
                        <li>
                            Verifieer dat CORS correct is ingesteld op je WordPress-server zodat requests vanaf
                            <code className="bg-gray-100 text-sm p-1 rounded mx-1">localhost:3000</code> zijn toegestaan
                        </li>
                        <li>
                            Als je <code className="bg-gray-100 text-sm p-1 rounded mx-1">http://headless-wp.local</code> gebruikt,
                            zorg dan dat deze in je <code className="bg-gray-100 text-sm p-1 rounded mx-1">hosts</code> bestand staat en
                            lokaal bereikbaar is
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ConfigDebug;