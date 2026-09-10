/**
 * app/pt-br/terms-of-service/page.tsx
 */
import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';
import { STATIC_PAGES_PT_BR } from '@/data/pt-br/static-pages';

const PT_BR_BASE = `${SITE_URL}/pt-br`;
const { termsOfService } = STATIC_PAGES_PT_BR;

export const metadata: Metadata = {
  title: termsOfService.meta.title,
  description: termsOfService.meta.description,
  alternates: {
    canonical: `${PT_BR_BASE}/terms-of-service`,
    languages: {
      'en': `${SITE_URL}/terms-of-service`,
      'pt-BR': `${PT_BR_BASE}/terms-of-service`,
      'x-default': `${SITE_URL}/terms-of-service`,
    },
  },
};

export default function PtBrTermsPage() {
  return (
    <div className="container" style={{ padding: '48px 16px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{termsOfService.title}</h1>
      <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 24 }}>Última atualização: {termsOfService.lastUpdated}</p>
      <p style={{ lineHeight: 1.8, color: 'var(--text2)', marginBottom: 32 }}>{termsOfService.intro}</p>
      {termsOfService.sections.map(({ title, body }) => (
        <section key={title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text2)' }}>{body}</p>
        </section>
      ))}
    </div>
  );
}
