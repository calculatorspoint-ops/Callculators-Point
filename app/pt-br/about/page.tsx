/**
 * app/pt-br/about/page.tsx — Sobre Nós (Portuguese About page)
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';
import { STATIC_PAGES_PT_BR } from '@/data/pt-br/static-pages';

const PT_BR_BASE = `${SITE_URL}/pt-br`;
const { about } = STATIC_PAGES_PT_BR;

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: {
    canonical: `${PT_BR_BASE}/about`,
    languages: {
      'en': `${SITE_URL}/about`,
      'pt-BR': `${PT_BR_BASE}/about`,
      'x-default': `${SITE_URL}/about`,
    },
  },
};

export default function PtBrAboutPage() {
  return (
    <div className="container" style={{ padding: '48px 16px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{about.hero.title}</h1>
      <p style={{ color: 'var(--text2)', fontSize: 18, marginBottom: 40 }}>{about.hero.subtitle}</p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{about.mission.title}</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--text2)' }}>{about.mission.body}</p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{about.founder.title}</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--text2)' }}>{about.founder.body}</p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>{about.values.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {about.values.items.map(({ icon, title, body }) => (
            <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{about.contact.title}</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--text2)', marginBottom: 12 }}>{about.contact.body}</p>
        <Link href="/pt-br/contact" className="btn btn-primary">{about.contact.linkLabel}</Link>
      </section>
    </div>
  );
}
