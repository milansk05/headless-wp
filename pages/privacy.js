import { useContext } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { SiteContext } from './_app';

const PrivacyPolicy = () => {
    const { siteSettings } = useContext(SiteContext);

    // Breadcrumb items voor deze pagina
    const breadcrumbItems = [
        { breadcrumb: 'Home', href: '/' },
        { breadcrumb: 'Privacybeleid', href: '/privacy' }
    ];

    // Cookie instellingen knop handler
    const handleOpenCookieSettings = () => {
        if (typeof window !== 'undefined') {
            // Trigger event om cookie instellingen te openen
            const event = new CustomEvent('openCookieSettings');
            window.dispatchEvent(event);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Privacybeleid | {siteSettings.title || 'Mijn Blog'}</title>
                <meta
                    name="description"
                    content={`Privacybeleid en cookiebeleid van ${siteSettings.title || 'Mijn Blog'}. Informatie over hoe wij omgaan met je persoonsgegevens.`}
                />
            </Head>

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Breadcrumbs */}
                <div className="mb-6">
                    <Breadcrumbs
                        customCrumbs={breadcrumbItems}
                        className="py-2 text-gray-600"
                    />
                </div>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacybeleid</h1>

                    <div className="bg-blue-50 p-6 rounded-lg mb-8">
                        <p className="text-gray-700">
                            Dit privacybeleid is van toepassing op alle persoonsgegevens die {siteSettings.title || 'Wij'} verwerkt van bezoekers van onze website.
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={handleOpenCookieSettings}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Cookie instellingen aanpassen
                            </button>
                        </div>
                    </div>

                    {/* Privacybeleid inhoud */}
                    <div className="prose prose-lg max-w-none">
                        <h2>1. Verantwoordelijke</h2>
                        <p>
                            Verantwoordelijk voor de verwerking van persoonsgegevens is: {siteSettings.title || 'Ons bedrijf'},
                            {siteSettings.contactAdres ? ` gevestigd op ${siteSettings.contactAdres}, ` : ' '}
                            {siteSettings.contactEmail ? ` bereikbaar via e-mail: ${siteSettings.contactEmail}` : ''}.
                        </p>

                        <h2>2. Welke gegevens verwerken we en waarom</h2>
                        <p>
                            Wij verwerken persoonsgegevens die je zelf aan ons hebt verstrekt, bijvoorbeeld bij het invullen van een contactformulier,
                            het plaatsen van een reactie of het inschrijven voor onze nieuwsbrief. Afhankelijk van de functionaliteit kunnen
                            deze gegevens bestaan uit je naam, e-mailadres, telefoonnummer, en de inhoud van je bericht.
                        </p>

                        <h3>2.1. Analytische gegevens</h3>
                        <p>
                            Daarnaast verzamelen wij automatisch bepaalde gegevens over je bezoek aan onze website, zoals je IP-adres,
                            browsertype, bezochte pagina&apos;s en de tijd en datum van je bezoek. Deze gegevens worden gebruikt voor analytische
                            doeleinden om onze website te verbeteren en worden niet gebruikt om je persoonlijk te identificeren.
                        </p>

                        <h2>3. Cookies</h2>
                        <p>
                            Onze website maakt gebruik van cookies. Cookies zijn kleine tekstbestanden die door je browser worden opgeslagen op je apparaat.
                        </p>

                        <h3>3.1. Soorten cookies die we gebruiken</h3>
                        <ul>
                            <li>
                                <strong>Noodzakelijke cookies:</strong> Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld.
                                Ze worden meestal alleen geplaatst als reactie op acties die door jou worden uitgevoerd, zoals het instellen van privacyvoorkeuren,
                                inloggen of het invullen van formulieren.
                            </li>
                            <li>
                                <strong>Functionele cookies:</strong> Deze cookies maken verbeterde functionaliteit en personalisatie mogelijk.
                                Ze kunnen door ons of door externe aanbieders worden geplaatst wiens diensten we aan onze pagina&apos;s hebben toegevoegd.
                            </li>
                            <li>
                                <strong>Analytische cookies:</strong> Deze cookies stellen ons in staat om bezoeken en verkeersbronnen bij te houden,
                                zodat we de prestaties van onze site kunnen meten en verbeteren. Ze helpen ons te begrijpen welke pagina&apos;s het meest
                                en minst populair zijn en hoe bezoekers zich door de site bewegen.
                            </li>
                            <li>
                                <strong>Marketing cookies:</strong> Deze cookies kunnen door onze advertentiepartners op onze site worden geplaatst.
                                Ze kunnen worden gebruikt om een profiel van je interesses op te bouwen en relevante advertenties op andere sites te tonen.
                            </li>
                        </ul>

                        <h3>3.2. Je cookie-instellingen beheren</h3>
                        <p>
                            Je kunt je cookievoorkeuren op elk moment aanpassen door te klikken op de knop &apos;Cookie-instellingen aanpassen&apos;
                            bovenaan deze pagina. Daarnaast kun je cookies beheren of verwijderen via de instellingen van je browser.
                        </p>

                        <h2>4. Bewaartermijnen</h2>
                        <p>
                            Wij bewaren je persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld.
                            Contactformuliergegevens worden bewaard zolang nodig is om je vraag te beantwoorden,
                            reacties blijven bewaard zolang het bijbehorende artikel op de website staat, en nieuwsbriefabonnementen
                            blijven actief tot je je afmeldt.
                        </p>

                        <h2>5. Delen met derden</h2>
                        <p>
                            Wij verstrekken je persoonsgegevens alleen aan derden als dit nodig is voor de uitvoering van onze overeenkomst met jou
                            of om te voldoen aan een wettelijke verplichting. Met bedrijven die je gegevens verwerken in onze opdracht
                            (zoals onze hosting provider of nieuwsbriefdienst) sluiten wij verwerkersovereenkomsten om te zorgen voor
                            eenzelfde niveau van beveiliging en vertrouwelijkheid van je gegevens.
                        </p>

                        <h2>6. Beveiliging</h2>
                        <p>
                            Wij nemen passende technische en organisatorische maatregelen om je persoonsgegevens te beschermen tegen verlies,
                            onrechtmatige verwerking of onbevoegde toegang. Onze website maakt gebruik van een SSL-certificaat voor een beveiligde verbinding.
                        </p>

                        <h2>7. Je rechten</h2>
                        <p>
                            Je hebt het recht om je persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heb je het recht om je
                            toestemming voor de gegevensverwerking in te trekken en heb je recht op gegevensoverdraagbaarheid.
                            Je kunt een verzoek tot inzage, correctie, verwijdering of gegevensoverdracht van je persoonsgegevens sturen naar
                            {siteSettings.contactEmail ? ` ${siteSettings.contactEmail}` : ' ons e-mailadres'}.
                        </p>

                        <h2>8. Klachten</h2>
                        <p>
                            Als je een klacht hebt over de verwerking van je persoonsgegevens, neem dan contact met ons op. Je hebt ook het recht
                            om een klacht in te dienen bij de Autoriteit Persoonsgegevens.
                        </p>

                        <h2>9. Wijzigingen in dit privacybeleid</h2>
                        <p>
                            Wij behouden ons het recht voor om dit privacybeleid aan te passen. Wijzigingen zullen op deze website worden gepubliceerd.
                            Het is daarom raadzaam om deze pagina regelmatig te raadplegen.
                        </p>

                        <p className="italic mt-8">
                            Laatste update: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Cookie instellingen knop onderin */}
                    <div className="mt-10 text-center">
                        <button
                            onClick={handleOpenCookieSettings}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            Cookie instellingen aanpassen
                        </button>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default PrivacyPolicy;