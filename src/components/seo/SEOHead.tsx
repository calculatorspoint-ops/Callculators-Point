import { Helmet } from "react-helmet-async";
import { CalculatorConfig } from "@/data/calculatorConfigs";

export function SEOHead({ calc, catName }: { calc: CalculatorConfig; catName: string }) {
  return (
    <Helmet>
      <title>{`Free ${calc.name} Online — ${calc.desc?.slice(0, 60)} | CalculatorsPoint`}</title>
      <meta name="description" content={`Use our free ${calc.name} online with instant results, visual charts & step-by-step breakdowns. ${calc.desc}. No signup — 100% private & accurate.`} />
      <meta name="keywords" content={`${calc.name.toLowerCase()}, free ${calc.name.toLowerCase()}, online ${calc.name.toLowerCase()}, ${catName.toLowerCase()} calculator`} />
      <meta property="og:title" content={`${calc.name} — Free Online Calculator | CalculatorsPoint`} />
      <meta property="og:description" content={`Free ${calc.name}: ${calc.desc}. Instant results with charts & insights.`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://calculatorspoint.com/calculator/${calc.slug}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${calc.name} — Free Online Calculator`} />
      <meta name="twitter:description" content={calc.desc} />
      <link rel="canonical" href={`https://calculatorspoint.com/calculator/${calc.slug}`} />
      {/* BreadcrumbList Schema */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calculatorspoint.com/" },
          { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://calculatorspoint.com/calculators" },
          { "@type": "ListItem", "position": 3, "name": catName || "Tools", "item": `https://calculatorspoint.com/category/${calc.cat}` },
          { "@type": "ListItem", "position": 4, "name": calc.name }
        ]
      })}</script>
      {/* WebApplication Schema */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": calc.name,
        "description": calc.desc,
        "url": `https://calculatorspoint.com/calculator/${calc.slug}`,
        "applicationCategory": catName === "Finance & Money" ? "FinanceApplication" : catName === "Health & Fitness" ? "HealthApplication" : "UtilityApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      })}</script>
    </Helmet>
  );
}
