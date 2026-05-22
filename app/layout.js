import './globals.css';

export const metadata = {
  title: 'ProofFlow AI - AI-Powered Proof Reports & SEO Content for Local Trades',
  description: 'Turn daily completed trade photos into professional branded PDF proof sheets, targeted local SEO keywords, and social post copies in seconds.',
  keywords: [
    'Tradesmen AI', 'Proof of Work Reports', 'Local SEO Plumber', 'Mover Social Content', 
    'Electrician AI', 'Painter Local SEO', 'Roofer Proof Sheets', 'Handyman Content Writer'
  ],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  metadataBase: new URL('https://proofflow.nl'),
  openGraph: {
    title: 'ProofFlow AI - Turn Work Photos Into Proof & Local Marketing',
    description: 'Smart AI tools for local service trades. Upload before/after photos, generate client-ready PDF summaries, and boost local Google rankings.',
    url: 'https://proofflow.nl',
    siteName: 'ProofFlow AI',
    locale: 'nl_NL',
    type: 'website',
    images: [
      {
        url: '/images/og-showcase.png',
        width: 1200,
        height: 630,
        alt: 'ProofFlow AI SaaS Dashboard Showcase',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProofFlow AI - AI-Powered Proof Sheets & Local SEO for Trades',
    description: 'Transform completed trade work photos into instant client trust PDF certificates and community Nextdoor/Facebook updates.',
    images: ['/images/og-showcase.png'],
  }
};

export default function RootLayout({ children }) {
  // Inject structural Schema.org local business indicators to maximize rank indexing
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ProofFlow AI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "description": "AI-powered marketing assistant for local service trades. Turn completed job photos into PDF proof sheets and targeted local SEO content.",
    "offers": {
      "@type": "Offer",
      "price": "29.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="h-full antialiased text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}
