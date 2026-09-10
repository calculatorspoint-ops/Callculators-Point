/**
 * app/pt-br/contact/page.tsx — Fale Conosco (Portuguese Contact page)
 */
import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';
import { STATIC_PAGES_PT_BR } from '@/data/pt-br/static-pages';

const PT_BR_BASE = `${SITE_URL}/pt-br`;
const { contact } = STATIC_PAGES_PT_BR;

export const metadata: Metadata = {
  title: contact.meta.title,
  description: contact.meta.description,
  alternates: {
    canonical: `${PT_BR_BASE}/contact`,
    languages: {
      'en': `${SITE_URL}/contact`,
      'pt-BR': `${PT_BR_BASE}/contact`,
      'x-default': `${SITE_URL}/contact`,
    },
  },
};

export default function PtBrContactPage() {
  return (
    <div className="container" style={{ padding: '48px 16px', maxWidth: 700 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{contact.hero.title}</h1>
      <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 40 }}>{contact.hero.subtitle}</p>

      {/* Common topics */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{contact.topics.title}</h2>
        <ul style={{ paddingLeft: 20, color: 'var(--text2)', lineHeight: 2 }}>
          {contact.topics.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Direct contact */}
      <section style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 28,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{contact.directContact.title}</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 8 }}>
          <strong>{contact.directContact.emailLabel}:</strong>{' '}
          <a
            href="mailto:contact@calculatorspoint.com"
            style={{ color: 'var(--brand)', fontWeight: 600 }}
          >
            contact@calculatorspoint.com
          </a>
        </p>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>{contact.directContact.responseTime}</p>
      </section>
    </div>
  );
}
