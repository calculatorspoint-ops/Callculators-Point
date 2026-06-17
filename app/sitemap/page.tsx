import type { Metadata } from 'next';
import Link from 'next/link';
import { CALC_COUNT_LABEL, CATEGORIES, INDEXABLE_CALCULATORS } from '@/data/calculatorConfigs';
import { SEO_LANDING_PAGES } from '@/data/seoLandingData';
import { SITE_URL } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Sitemap',
  description:
    `Complete sitemap of Calculators Point - browse all ${CALC_COUNT_LABEL} free online calculators, category pages, name generators, cheat sheets, and SEO tool guides.`,
  alternates: { canonical: 'https://calculatorspoint.com/sitemap' },
  openGraph: {
    title: 'Sitemap | Calculators Point',
    description:
      `Browse the full sitemap of Calculators Point with ${CALC_COUNT_LABEL} calculators across 9 categories. Find every tool, generator, and guide.`,
    url: 'https://calculatorspoint.com/sitemap',
    type: 'website',
    siteName: 'Calculators Point',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap | Calculators Point',
    description:
      `Browse the full sitemap of Calculators Point with ${CALC_COUNT_LABEL} calculators across 9 categories.`,
  },
};

const SITEMAP_URL = `${SITE_URL}/sitemap`;

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${SITEMAP_URL}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Sitemap', item: SITEMAP_URL },
  ],
};

const webPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITEMAP_URL}#webpage`,
  url: SITEMAP_URL,
  name: 'Sitemap | Calculators Point',
  description: `Complete sitemap of Calculators Point - ${CALC_COUNT_LABEL} free online calculators across 9 categories.`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  breadcrumb: { '@id': `${SITEMAP_URL}#breadcrumb` },
  inLanguage: 'en-US',
  about: { '@type': 'Thing', name: 'Online Calculators' },
};

const categoryList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Calculator Categories on Calculators Point',
  description: `Browse all ${CALC_COUNT_LABEL} free online calculators by category.`,
  url: SITEMAP_URL,
  numberOfItems: CATEGORIES.length,
  itemListElement: CATEGORIES.map((cat, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${cat.name} Calculators`,
    url: `${SITE_URL}/category/${cat.id}`,
  })),
};

type SiteLink = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
};

function uniqueLinks(links: SiteLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

export default function SitemapPage() {
  const categorySections = CATEGORIES.map((category) => ({
    title: `${category.name} Calculators`,
    icon: category.icon,
    links: uniqueLinks(
      INDEXABLE_CALCULATORS
        .filter((calc) => calc.cat === category.id)
        .map((calc) => ({
          href: `/calculator/${calc.slug}`,
          label: calc.name,
          icon: calc.icon || category.icon,
          badge: calc.isNew ? 'NEW' : calc.popular ? 'Popular' : undefined,
        }))
    ),
  }));

  const sections = [
    {
      title: 'Core Pages',
      icon: 'Home',
      links: [
        { href: '/', label: 'Homepage', icon: 'Home' },
        { href: '/calculators', label: 'All Calculators', icon: 'Tools' },
        { href: '/about', label: 'About Us', icon: 'Info' },
        { href: '/contact', label: 'Contact Us', icon: 'Mail' },
        { href: '/privacy-policy', label: 'Privacy Policy', icon: 'Lock' },
        { href: '/terms-of-service', label: 'Terms of Service', icon: 'Terms' },
        { href: '/disclaimer', label: 'Disclaimer', icon: 'Note' },
        { href: '/cookie-policy', label: 'Cookie Policy', icon: 'Cookie' },
        { href: '/sitemap', label: 'Sitemap', icon: 'Map' },
      ],
    },
    {
      title: 'Calculator Categories',
      icon: 'Categories',
      links: CATEGORIES.map((category) => ({
        href: `/category/${category.id}`,
        label: category.name,
        icon: category.icon,
      })),
    },
    ...categorySections,
    {
      title: 'Specialized Tool Guides',
      icon: 'Guides',
      links: SEO_LANDING_PAGES.map((page) => ({
        href: `/tools/${page.slug}`,
        label: page.h1,
        icon: 'Guide',
      })),
    },
    {
      title: 'Name Generators',
      icon: 'Names',
      links: [
        { href: '/name-generators', label: 'All Name Generators', icon: 'Names' },
        { href: '/name-generators/baby-name-generator', label: 'Baby Name Generator', icon: 'Baby' },
        { href: '/name-generators/islamic-baby-names', label: 'Islamic Baby Names', icon: 'Names' },
        { href: '/name-generators/business-name-generator', label: 'Business Name Generator', icon: 'Biz' },
        { href: '/name-generators/brand-name-generator', label: 'Brand Name Generator', icon: 'Brand' },
        { href: '/name-generators/youtube-channel-name-generator', label: 'YouTube Channel Name', icon: 'Video' },
        { href: '/name-generators/instagram-username-generator', label: 'Instagram Username', icon: 'IG' },
        { href: '/name-generators/domain-name-generator', label: 'Domain Name Generator', icon: 'Web' },
        { href: '/name-generators/app-name-generator', label: 'App Name Generator', icon: 'App' },
      ],
    },
    {
      title: 'Ecosystem Hubs',
      icon: 'Hubs',
      links: [
        { href: '/ecosystem/finance', label: 'Finance Ecosystem', icon: 'Finance' },
        { href: '/ecosystem/fitness', label: 'Fitness Ecosystem', icon: 'Fitness' },
        { href: '/ecosystem/education', label: 'Education Ecosystem', icon: 'Education' },
      ],
    },
  ].map((section) => ({ ...section, links: uniqueLinks(section.links) }));

  const totalPages = sections.reduce((sum, section) => sum + section.links.length, 0);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 64 }}>
      <JsonLd data={[breadcrumb, webPage, categoryList]} idPrefix="sitemap" />

      <section className="page-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>Map</div>
          <h1>Sitemap</h1>
          <p>A complete map of every page on Calculators Point - {totalPages.toLocaleString()} pages across {CATEGORIES.length} calculator categories.</p>
        </div>
      </section>

      <div className="page-wrap" style={{ maxWidth: 1120 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { value: totalPages.toLocaleString(), label: 'Total Pages' },
            { value: INDEXABLE_CALCULATORS.length.toLocaleString(), label: 'Calculators' },
            { value: CATEGORIES.length, label: 'Categories' },
            { value: SEO_LANDING_PAGES.length, label: 'Tool Guides' },
            { value: 9, label: 'Name Generators' },
          ].map((item) => (
            <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand)', lineHeight: 1 }}>{item.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 6 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {sections.map((section) => (
          <section key={section.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
              <span style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 800, minWidth: 64 }}>{section.icon}</span>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 850, color: 'var(--text)' }}>{section.title}</h2>
              <span style={{ marginLeft: 'auto', color: 'var(--text3)', fontSize: 12, fontWeight: 700 }}>{section.links.length} pages</span>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))' }}>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    minHeight: 48,
                    padding: '10px 16px',
                    borderRight: '1px solid var(--bord2, rgba(148,163,184,.14))',
                    borderBottom: '1px solid var(--bord2, rgba(148,163,184,.14))',
                    color: 'var(--text2)',
                    textDecoration: 'none',
                    fontSize: 13,
                    lineHeight: 1.35,
                  }}
                >
                  <span aria-hidden="true" style={{ width: 42, color: 'var(--text3)', fontSize: 11, fontWeight: 800, textAlign: 'center', flexShrink: 0 }}>{link.icon}</span>
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.label}</span>
                  {link.badge && (
                    <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 999, padding: '1px 6px' }}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section style={{ textAlign: 'center', padding: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <p style={{ margin: '0 0 12px', color: 'var(--text2)' }}>For search engines, use the machine-readable XML sitemap.</p>
          <a href="/sitemap.xml" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, background: 'var(--brand)', color: '#fff', textDecoration: 'none', fontWeight: 800 }}>
            sitemap.xml
          </a>
        </section>
      </div>
    </main>
  );
}
