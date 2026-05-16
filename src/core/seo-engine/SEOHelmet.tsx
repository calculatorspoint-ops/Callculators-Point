import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  applicationCategory?: string;
}

export function SEOHelmet({ title, description, canonicalUrl, applicationCategory = "FinanceApplication" }: SEOHelmetProps) {
  const fullTitle = `${title} | CalculatorsPoint Pro`;
  
  // High-value JSON-LD Schema for SoftwareApplication
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "applicationCategory": applicationCategory,
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph for rich social sharing */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Programmatic JSON-LD Injection */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

