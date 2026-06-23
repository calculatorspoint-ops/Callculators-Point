/**
 * src/components/ui/Breadcrumb.tsx
 * Reusable breadcrumb with Schema.org BreadcrumbList structured data.
 */
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 10 }}>
      <ol
        style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', listStyle: 'none', margin: 0, padding: 0 }}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, i) => (
          <li
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {i > 0 && (
              <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, userSelect: 'none' }} aria-hidden="true">›</span>
            )}
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.55)')}
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span
                style={{ fontSize: 12, fontWeight: 600, color: i === items.length - 1 ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.55)' }}
                itemProp="name"
                aria-current={i === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(i + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
