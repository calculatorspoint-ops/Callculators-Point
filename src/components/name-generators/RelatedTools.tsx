'use client';
import Link from 'next/link';
import type { GeneratorTool } from '@/data/name-generators/tools-config';

interface RelatedToolsProps {
  tools: GeneratorTool[];
  currentToolId: string;
}

export function RelatedTools({ tools, currentToolId }: RelatedToolsProps) {
  const related = tools.filter((t) => t.id !== currentToolId);
  if (related.length === 0) return null;

  return (
    <section className="ng-related" aria-labelledby="related-tools-title">
      <div className="ng-container">
        <span className="ng-section-label">Explore More</span>
        <h2 className="ng-section-title" id="related-tools-title">Related Generator Tools</h2>
        <p className="ng-section-desc">
          Discover more free name generator tools to find the perfect name for every purpose.
        </p>
        <div className="ng-related-grid">
          {related.map((tool) => (
            <Link
              key={tool.id}
              href={`/name-generators/${tool.slug}`}
              className="ng-related-card"
              aria-label={`Go to ${tool.title}`}
            >
              <span className="ng-related-icon" aria-hidden="true">{tool.icon}</span>
              <div>
                <div className="ng-related-title">{tool.title}</div>
                <div className="ng-related-desc">{tool.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
