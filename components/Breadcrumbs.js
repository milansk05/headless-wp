import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Breadcrumbs = ({ customCrumbs, homeText = "Home", className = "", separator = "/" }) => {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        if (router) {
            // Als er aangepaste breadcrumbs zijn doorgegeven, gebruik deze
            if (customCrumbs && customCrumbs.length > 0) {
                setBreadcrumbs(customCrumbs);
                return;
            }

            // Anders maak breadcrumbs op basis van de huidige URL
            const linkPath = router.asPath.split('/');
            linkPath.shift(); // Verwijder het eerste lege element

            // Verwijder query parameters uit het pad
            const pathWithoutQuery = linkPath.map(path => path.split('?')[0]);

            // Maak de breadcrumbs array
            const pathArray = pathWithoutQuery.map((path, i) => {
                // Decodeer URL-parameters (bijv. %20 naar spatie)
                const decodedPath = decodeURIComponent(path);

                // Maak een leesbare naam van het path segment door streepjes te vervangen door spaties
                // en de eerste letter van elk woord hoofdletter te maken
                const formattedName = decodedPath
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                // Bouw het pad op voor de link
                const href = '/' + pathWithoutQuery.slice(0, i + 1).join('/');

                return {
                    breadcrumb: formattedName,
                    href
                };
            });

            // Voeg Home toe aan het begin
            setBreadcrumbs([
                { breadcrumb: homeText, href: '/' },
                ...pathArray
            ]);
        }
    }, [router, customCrumbs, homeText]);

    if (!breadcrumbs.length) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
            <ol className="flex flex-wrap items-center">
                {breadcrumbs.map((breadcrumb, i) => {
                    const isLast = i === breadcrumbs.length - 1;
                    return (
                        <li
                            key={breadcrumb.href}
                            className="flex items-center"
                        >
                            {!isLast ? (
                                <>
                                    <Link
                                        href={breadcrumb.href}
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        {breadcrumb.breadcrumb}
                                    </Link>
                                    <span className="mx-2 text-gray-500">{separator}</span>
                                </>
                            ) : (
                                <span className="text-gray-700 font-medium" aria-current="page">
                                    {breadcrumb.breadcrumb}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;