import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
}

export default function SEO({ title, description, url = "https://tu-dominio.com" }: SEOProps) {
  // SCHEMA.ORG: Esto es Growth Hacking puro. Le dice a Google exactamente qué es esta página.
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "Coach Irene - Personal Trainer",
    "image": `${url}/og-image.jpg`,
    "description": description,
    "url": url,
    "telephone": "+51999999999", // Cambiar por el real
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lima",
      "addressCountry": "PE"
    }
  };

  return (
    <Helmet>
      {/* Etiquetas Básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL (Evita penalizaciones por contenido duplicado) */}
      <link rel="canonical" href={url} />

      {/* Open Graph (Para compartir en Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${url}/og-image.jpg`} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Inyección de Schema.org en formato JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
}