'use client';
import { useState, useMemo, useCallback } from 'react';
import { useGeneratorEngine, type GeneratorFilters, type GeneratedName } from '@/hooks/name-generators/useGeneratorEngine';
import { useFavorites } from '@/hooks/name-generators/useFavorites';
import { ResultCard } from './ResultCard';
import { LoadingSkeletons } from './LoadingSkeletons';
import { SearchFilter } from './SearchFilter';
import { FavoriteList, FavoritesFAB } from './FavoriteList';
import { FAQSection } from './FAQSection';
import { SEOContentBlock } from './SEOContentBlock';
import { RelatedTools } from './RelatedTools';
import type { GeneratorTool } from '@/data/name-generators/tools-config';
import type { FAQItem } from '@/data/name-generators/faq-data';

interface GeneratorLayoutProps {
  tool: GeneratorTool;
  allTools: GeneratorTool[];
  faqs: FAQItem[];
  formContent: React.ReactNode;
  filters: GeneratorFilters;
  gradientFrom?: string;
  gradientTo?: string;
  disclaimer?: string;
}

export function GeneratorLayout({
  tool,
  allTools,
  faqs,
  formContent,
  filters,
  gradientFrom = '#6366f1',
  gradientTo = '#8b5cf6',
  disclaimer,
}: GeneratorLayoutProps) {
  const { results, isLoading, hasGenerated, generate, generateMore } = useGeneratorEngine(tool.id);
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites, exportCSV } = useFavorites(tool.id);
  const [favOpen, setFavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return results;
    const q = searchQuery.toLowerCase();
    return results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.meaning?.toLowerCase().includes(q) ||
        r.tagline?.toLowerCase().includes(q)
    );
  }, [results, searchQuery]);

  const handleGenerate = useCallback(() => {
    generate(filters);
    setSearchQuery('');
  }, [generate, filters]);

  const handleGenerateMore = useCallback(() => {
    generateMore(filters);
  }, [generateMore, filters]);

  const handleRemoveFavorite = useCallback((name: string) => {
    const fav = favorites.find((f) => f.name === name);
    if (fav) removeFavorite(fav.id);
  }, [favorites, removeFavorite]);

  // WebApplication schema
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.metaDescription,
    url: `https://calculatorspoint.com/name-generators/${tool.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: tool.keywords.join(', '),
  };

  return (
    <div className="ng-page">
      {/* WebApplication schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div
        className="ng-hero"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}18 0%, ${gradientTo}12 100%)` }}
      >
        <div className="ng-container">
          <div className="ng-hero-content">
            <div
              className="ng-hero-badge"
              style={{
                background: `${gradientFrom}15`,
                borderColor: `${gradientFrom}40`,
                color: gradientFrom,
              }}
            >
              <span aria-hidden="true">{tool.icon}</span>
              <span>{tool.shortTitle}</span>
            </div>

            <h1 className="ng-hero-title">{tool.title}</h1>
            <p className="ng-hero-desc">{tool.heroDescription}</p>

            <div className="ng-trust-badges" role="list">
              {[
                { icon: '✓', label: '100% Free' },
                { icon: '⚡', label: 'Instant Results' },
                { icon: '🔒', label: 'No Signup Required' },
                { icon: '📋', label: 'Copy & Export' },
              ].map((badge) => (
                <div key={badge.label} className="ng-trust-badge" role="listitem">
                  <span aria-hidden="true">{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <div className="ng-container">
        <div className="ng-layout">

          {/* Form Panel */}
          <div className="ng-form-panel" role="complementary" aria-label="Generator options">
            {disclaimer && (
              <div className="ng-disclaimer" role="note">
                <span className="ng-disclaimer-icon" aria-hidden="true">⚠️</span>
                <span>{disclaimer}</span>
              </div>
            )}

            {formContent}

            <button
              className="ng-generate-btn"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`, color: 'white' }}
              onClick={handleGenerate}
              disabled={isLoading}
              aria-busy={isLoading}
              id="generate-btn"
            >
              {isLoading ? (
                <>
                  <span className="ng-spinner" aria-hidden="true" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">✨</span>
                  <span>Generate Names</span>
                </>
              )}
            </button>
          </div>

          {/* Results Area */}
          <div role="main" aria-label="Generated names">
            <SearchFilter
              totalCount={results.length}
              onFilter={setSearchQuery}
              placeholder={`Search ${results.length} generated names...`}
            />

            <div className="ng-results-grid" aria-live="polite" aria-atomic="false">
              {isLoading ? (
                <LoadingSkeletons count={6} />
              ) : !hasGenerated ? (
                <div className="ng-empty">
                  <div className="ng-empty-icon" aria-hidden="true">{tool.icon}</div>
                  <h2 className="ng-empty-title">Ready to generate names!</h2>
                  <p className="ng-empty-desc">
                    Fill in the options on the left and click{' '}
                    <strong>Generate Names</strong> to see your results.
                  </p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="ng-empty">
                  <div className="ng-empty-icon" aria-hidden="true">🔍</div>
                  <h2 className="ng-empty-title">No matches found</h2>
                  <p className="ng-empty-desc">
                    Try adjusting your search or filters, then generate again.
                  </p>
                </div>
              ) : (
                filteredResults.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    toolId={tool.id}
                    toolName={tool.title}
                    isFavorite={isFavorite(result.name)}
                    onSave={addFavorite}
                    onRemove={handleRemoveFavorite}
                  />
                ))
              )}
            </div>

            {/* Generate More */}
            {hasGenerated && !isLoading && results.length > 0 && (
              <div className="ng-generate-more">
                <button
                  className="ng-more-btn"
                  onClick={handleGenerateMore}
                  aria-label="Generate more names"
                >
                  <span aria-hidden="true">🔄</span>
                  <span>Generate More Names</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SEO Content */}
      <SEOContentBlock
        howItWorks={tool.howItWorks}
        tips={tool.tips}
        toolName={tool.title}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} toolId={tool.id} />

      {/* Related Tools */}
      <RelatedTools tools={allTools} currentToolId={tool.id} />

      {/* Favorites FAB + Drawer */}
      <FavoritesFAB
        count={favorites.length}
        onClick={() => setFavOpen(true)}
        color={gradientFrom}
      />
      <FavoriteList
        favorites={favorites}
        isOpen={favOpen}
        onClose={() => setFavOpen(false)}
        onRemove={removeFavorite}
        onClear={clearFavorites}
        onExportCSV={exportCSV}
        toolName={tool.title}
      />
    </div>
  );
}
