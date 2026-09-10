/**
 * app/pt-br/privacy-policy/page.tsx
 */
import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';
import { STATIC_PAGES_PT_BR } from '@/data/pt-br/static-pages';

const PT_BR_BASE = `${SITE_URL}/pt-br`;
const { privacyPolicy } = STATIC_PAGES_PT_BR;

export const metadata: Metadata = {
  title: privacyPolicy.meta.title,
  description: privacyPolicy.meta.description,
  alternates: {
    canonical: `${PT_BR_BASE}/privacy-policy`,
    languages: {
      'en': `${SITE_URL}/privacy-policy`,
      'pt-BR': `${PT_BR_BASE}/privacy-policy`,
      'x-default': `${SITE_URL}/privacy-policy`,
    },
  },
};

export default function PtBrPrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '48px 16px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{privacyPolicy.title}</h1>
      <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 24 }}>Última atualização: {privacyPolicy.lastUpdated}</p>
      <p style={{ lineHeight: 1.8, color: 'var(--text2)', marginBottom: 32 }}>{privacyPolicy.intro}</p>
      {privacyPolicy.sections.map(({ title, body }) => (
        <section key={title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text2)' }}>{body}</p>
        </section>
      ))}
    </div>
  );
}
