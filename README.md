# Headless WordPress met Next.js

Deze repository bevat een volledig functionele frontend gebouwd met Next.js voor een headless WordPress website. Het project gebruikt WordPress als content management systeem (CMS) via de GraphQL API, waardoor je een ultrasnelle en moderne website krijgt met alle voordelen van WordPress voor contentbeheer.

## Inhoudsopgave

- [Overzicht](#overzicht)
- [Functies](#functies)
- [Technologieën](#technologieën)
- [Vereisten](#vereisten)
- [Installatie](#installatie)
- [Projectstructuur](#projectstructuur)
- [Configuratie](#configuratie)
- [WordPress Configuratie](#wordpress-configuratie)
- [API Integratie](#api-integratie)
- [Routes en Pagina's](#routes-en-paginas)
- [Componenten](#componenten)
- [Styling](#styling)
- [Deploy](#deploy)
- [Veelgestelde vragen](#veelgestelde-vragen)
- [Probleemoplossing](#probleemoplossing)

## Overzicht

Dit project is een headless WordPress implementatie met Next.js als frontend. Headless betekent dat WordPress alleen wordt gebruikt als een backend voor contentbeheer, terwijl de frontend volledig losstaat van WordPress en gebruikt maakt van de WordPress API om content op te halen.

Voordelen van deze aanpak:
- **Betere prestaties**: Next.js biedt statische pagina generatie en server-side rendering
- **Moderne developer ervaring**: Gebruik React en moderne JavaScript tools
- **Flexibiliteit**: Vrijheid in frontend technologiekeuze
- **Schaalbaarheid**: De frontend kan eenvoudig worden geschaald onafhankelijk van de backend
- **Veiligheid**: De WordPress-installatie kan worden afgeschermd van het publiek

## Functies

Deze implementatie bevat de volgende functies:

- ✅ Blogposts ophalen en weergeven
- ✅ Pagina's ophalen en weergeven
- ✅ Categorieën en filtering
- ✅ Reacties op posts (schrijven en lezen)
- ✅ Contactformulier
- ✅ Nieuwsbrief inschrijving
- ✅ Responsief ontwerp (mobile-friendly)
- ✅ SEO-geoptimaliseerd
- ✅ Snelle laadtijden dankzij Next.js optimalisaties

## Technologieën

- **Frontend**: 
  - Next.js 15.3.1
  - React 19
  - TailwindCSS 4.1.4
  - GraphQL Request 7.1.2

- **Backend**: 
  - WordPress (met WPGraphQL plugin)
  
- **Overig**:
  - Nodemailer (voor contactformulier)

## Vereisten

Voordat je begint, zorg ervoor dat je het volgende hebt geïnstalleerd:

- Node.js (versie 18 of hoger)
- npm of yarn
- Een WordPress installatie met:
  - WPGraphQL plugin
  - (Optioneel) ACF (Advanced Custom Fields) en WPGraphQL for ACF
  - Juiste CORS-instellingen voor ontwikkeling en productie

## Installatie

### 1. Clone de repository

```bash
git clone [repository-url]
cd headless-wp-frontend
```

### 2. Installeer de dependencies

```bash
npm install
# of
yarn install
```

### 3. Configureer de omgevingsvariabelen

Maak een `.env.local` bestand aan in de hoofdmap van het project:

```
NEXT_PUBLIC_WORDPRESS_API_URL=https://jouw-wordpress-site.nl/graphql
```

Vervang `https://jouw-wordpress-site.nl/graphql` met de URL van jouw WordPress GraphQL endpoint.

Voor het contactformulier (optioneel), voeg deze variabelen toe:

```
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=jouw@email.nl
SMTP_PASSWORD=jouw-wachtwoord
CONTACT_EMAIL=contact@jouwsite.nl
```

### 4. Start de ontwikkelingsserver

```bash
npm run dev
# of
yarn dev
```

Je site draait nu op `http://localhost:3000`

## Projectstructuur

```
/
├── components/           # React componenten
├── lib/                  # Hulpfuncties en API handlers
├── pages/                # Next.js pagina's
│   ├── api/              # API routes voor de serverless functies
│   ├── category/         # Categorieën pagina's
│   └── posts/            # Blog post pagina's
├── public/               # Statische bestanden (afbeeldingen, etc.)
├── styles/               # CSS bestanden
├── next.config.js        # Next.js configuratie
├── tailwind.config.js    # Tailwind CSS configuratie
└── package.json          # Project dependencies
```

## Configuratie

### Next.js Configuratie

In `next.config.js` zijn de volgende zaken geconfigureerd:

1. **Image domains**: Toegestane domeinen voor Next.js Image optimalisatie
2. **API rewrite**: Het GraphQL endpoint wordt herschreven naar `/api/graphql`

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'headless-wp.local',
      'secure.gravatar.com',
      'www.gravatar.com',
      'i0.wp.com',
      'i1.wp.com',
      'i2.wp.com',
      // ...
    ],
    // ...
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://headless-wp.local/graphql', // Wijzig dit naar jouw WordPress URL
      },
    ];
  },
};
```

### TailwindCSS Configuratie

De styling is volledig gebaseerd op TailwindCSS, geconfigureerd in `tailwind.config.js`. Er is speciale aandacht voor typografie om WordPress content mooi weer te geven.

## WordPress Configuratie

### Benodigde plugins

1. **WPGraphQL** - [Download hier](https://wordpress.org/plugins/wp-graphql/)
2. **Advanced Custom Fields (ACF)** - [Download hier](https://wordpress.org/plugins/advanced-custom-fields/) (Pro versie aanbevolen)
3. **WPGraphQL for ACF** - [Download hier](https://github.com/wp-graphql/wp-graphql-acf)

### GraphQL Instellingen

Na installatie van WPGraphQL:

1. Ga naar GraphQL → Settings in je WordPress admin
2. Zorg ervoor dat de GraphQL endpoint is ingesteld op `/graphql`
3. Zet debugging uit voor productie (aan voor ontwikkeling)
4. Stel de juiste CORS-headers in om verzoeken van je frontend toe te staan

### Advanced Custom Fields

Voor site-instellingen zoals contactinformatie en sociale media, is een "Site Settings" veld gemaakt met ACF.

1. Maak een nieuwe ACF veldgroep genaamd "Site Settings"
2. Voeg velden toe voor:
   - contactEmail (Tekst)
   - contactTelefoon (Tekst)
   - contactAdres (Tekstgebied)
   - socialTwitter (URL)
   - socialFacebook (URL) 
   - socialInstagram (URL)
   - socialLinkedin (URL)
   - footerText (Tekstgebied)
   - newsletterTitel (Tekst)
   - newsletterTekst (Tekstgebied)
   - copyrightText (Tekst)
3. Wijs deze veldgroep toe aan een pagina genaamd "Over Mij"

## API Integratie

### GraphQL Queries

De GraphQL queries zijn gedefinieerd in `lib/queries.js`. Deze queries worden gebruikt om data op te halen van WordPress. Enkele belangrijke queries zijn:

- `GET_SITE_SETTINGS`: Haalt algemene site-instellingen op
- `GET_ALL_POSTS`: Haalt alle blogberichten op
- `GET_POST_BY_SLUG`: Haalt een specifiek bericht op via de slug
- `GET_CATEGORIES`: Haalt categorieën op
- `GET_POSTS_BY_CATEGORY`: Haalt berichten op per categorie

### API Client

De API client is gedefinieerd in `lib/api.js`. Deze bevat de `fetchAPI` functie die wordt gebruikt om GraphQL queries uit te voeren:

```javascript
export async function fetchAPI(query, { variables } = {}) {
  try {
    const graphQLClient = new GraphQLClient(graphqlAPI, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await graphQLClient.request(query, variables);
    return data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}
```

## Routes en Pagina's

### Belangrijkste routes

- `/` - Homepage met uitgelichte berichten
- `/blog` - Overzicht van alle blogberichten
- `/posts/[slug]` - Individuele blogberichten
- `/category/[slug]` - Berichten gefilterd op categorie
- `/[slug]` - Dynamische pagina's uit WordPress
- `/contact` - Contactpagina met formulier
- `/search` - Zoekresultaten

### Dynamische routes

De meeste pagina's gebruiken dynamische routes met `getStaticProps` en `getStaticPaths` van Next.js om:

1. Te bepalen welke pagina's gegenereerd moeten worden bij build-time
2. De data op te halen voor elke pagina

Bijvoorbeeld, in `pages/posts/[slug].js`:

```javascript
export async function getStaticPaths() {
  const data = await fetchAPI(GET_ALL_POSTS);
  const paths = data.posts.nodes.map((post) => ({
    params: { slug: post.slug },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const data = await fetchAPI(GET_POST_BY_SLUG, {
    variables: { slug: params.slug },
  });
  return {
    props: { post: data.post },
    revalidate: 60, // Incremental Static Regeneration
  };
}
```

## Componenten

De UI is opgebouwd uit herbruikbare componenten in de `components/` directory:

- `Header.js` - Site navigatie en logo
- `Footer.js` - Footer met site info, links en contactgegevens
- `PostCard.js` - Kaart voor blogberichten in lijsten
- `PostContent.js` - WordPress content renderer met styling
- `ContactForm.js` - Formulier voor contactpagina
- `CommentsSection.js` - Sectie voor reacties op berichten
- `SearchBar.js` - Zoekfunctionaliteit
- `Newsletter.js` - Nieuwsbrief inschrijfformulier

## Styling

De styling is volledig gebaseerd op TailwindCSS. Er zijn specifieke stijlen voor WordPress content in:

1. `styles/globals.css` - Bevat basisstijlen en WordPress content styling
2. `tailwind.config.js` - TailwindCSS configuratie, inclusief aangepaste typografie

WordPress content wordt gestijld met de `prose` klassen van `@tailwindcss/typography`:

```javascript
// In components/PostContent.js
<div
  className="prose prose-lg max-w-none prose-headings:font-semibold ... "
  dangerouslySetInnerHTML={{ __html: content }}
/>
```

## API Routes

Next.js API routes in `pages/api/` worden gebruikt voor serverless functies:

- `/api/comments.js` - Verwerkt het ophalen en plaatsen van reacties
- `/api/contact.js` - Verwerkt contactformulierinzendingen
- `/api/debug.js` - Hulpmiddel voor API debugging

### Contactformulier

De contactformulier API route gebruikt Nodemailer om e-mails te verzenden:

```javascript
// Gedeeltelijke code van pages/api/contact.js
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: (process.env.SMTP_SECURE || 'false') === 'true',
  auth: {
    user: process.env.SMTP_USER || 'jouw@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'jouw-app-wachtwoord',
  },
});

const info = await transporter.sendMail({
  from: `"${name}" <${email}>`,
  to: process.env.CONTACT_EMAIL || 'jouw@emailadres.nl',
  replyTo: email,
  subject: `Nieuw contactbericht: ${subject}`,
  text: `Naam: ${name}\nE-mail: ${email}\nOnderwerp: ${subject}\n\nBericht:\n${message}`,
  html: `...`, // HTML template
});
```

## Deploy

### Productie build

Om een productie build te maken:

```bash
npm run build
# of
yarn build
```

### Deploy op Vercel (aanbevolen)

1. Push je code naar een Git repository (GitHub, GitLab, Bitbucket)
2. Importeer je project in Vercel
3. Stel de omgevingsvariabelen in (NEXT_PUBLIC_WORDPRESS_API_URL, etc.)
4. Vercel zal automatisch je site bouwen en deployen

### Zelf hosten

Als je de site zelf wilt hosten:

```bash
npm run build && npm run start
# of
yarn build && yarn start
```

## Veelgestelde vragen

### Hoe voeg ik nieuwe pagina's toe?

Maak gewoon een nieuwe pagina aan in WordPress. De pagina wordt automatisch beschikbaar op `/[slug]` via de dynamische route.

### Hoe voeg ik menu-items toe?

Menu-items moeten worden aangepast in `components/Header.js`:

```javascript
const navigationItems = [
  { id: 1, label: 'Home', path: '/' },
  { id: 2, label: 'Blog', path: '/blog' },
  { id: 3, label: 'Over Mij', path: '/over-mij' },
  { id: 4, label: 'Contact', path: '/contact' }
];
```

### Werkt het contactformulier out-of-the-box?

Ja, maar je moet de SMTP-instellingen configureren in je `.env.local` bestand om e-mails te kunnen verzenden.

### Kan ik WordPress plugins gebruiken?

Ja, maar alleen voor backend functionaliteit. Plugins die de frontend wijzigen zullen niet werken in deze headless setup.

## Probleemoplossing

### API verbindingsproblemen

Als je problemen hebt met de verbinding naar de WordPress API:

1. Controleer of de `NEXT_PUBLIC_WORDPRESS_API_URL` correct is ingesteld
2. Zorg ervoor dat de WPGraphQL plugin is geactiveerd
3. Test de API verbinding op `/config` pagina
4. Controleer CORS-headers op je WordPress server

### Content wordt niet getoond

1. Bekijk de GraphQL-query met console logging
2. Controleer of de content bestaat in WordPress
3. Controleer of de data structuur overeenkomt met wat in de componenten wordt verwacht

### Contactformulier werkt niet

1. Controleer of de SMTP-instellingen correct zijn
2. Test met een SMTP dienst (zoals Gmail, Mailgun, SendGrid)
3. Controleer de logs voor fouten

### Debug pagina

Er is een speciale debugpagina beschikbaar op `/config` om de API-verbinding te testen.