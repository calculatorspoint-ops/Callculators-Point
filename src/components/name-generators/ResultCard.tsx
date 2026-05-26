'use client';
import { useState, useMemo } from 'react';
import { NameScoreCard } from './NameScoreCard';
import { scoreNameField } from '@/hooks/name-generators/useNameScore';
import type { GeneratedName } from '@/hooks/name-generators/useGeneratorEngine';
import type { FavoriteItem } from '@/hooks/name-generators/useFavorites';
import { useClipboard } from '@/hooks/name-generators/useClipboard';

interface ResultCardProps {
  result: GeneratedName;
  toolId: string;
  toolName: string;
  isFavorite: boolean;
  onSave: (item: Omit<FavoriteItem, 'id' | 'toolId' | 'savedAt'>) => void;
  onRemove: (name: string) => void;
  favoriteId?: string;
}

export function ResultCard({
  result,
  toolId,
  toolName,
  isFavorite,
  onSave,
  onRemove,
  favoriteId,
}: ResultCardProps) {
  const { copy, isCopied } = useClipboard();
  const [scoreExpanded, setScoreExpanded] = useState(false);
  const score = useMemo(() => scoreNameField(result.name), [result.name]);

  const handleCopy = () => copy(result.name, result.id);

  const handleShare = async () => {
    const text = `${result.name}${result.meaning ? ` — ${result.meaning}` : ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: result.name, text, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      copy(text, `share-${result.id}`);
    }
  };

  const handleSaveToggle = () => {
    if (isFavorite) {
      onRemove(result.name);
    } else {
      onSave({
        name: result.name,
        meaning: result.meaning,
        tagline: result.tagline,
        toolName,
      });
    }
  };

  const genderBadge = result.category === 'boy' ? 'ng-badge-boy'
    : result.category === 'girl' ? 'ng-badge-girl'
    : result.category === 'unisex' ? 'ng-badge-unisex' : '';

  return (
    <article className="ng-card ng-card-animate" aria-label={`Name result: ${result.name}`}>
      {/* Card top gradient line matches tool color via inline style */}
      <style>{`.ng-card::before { background: linear-gradient(90deg, var(--ng-accent-1), var(--ng-accent-2)); }`}</style>

      {/* Header row: name + badges */}
      <div className="ng-card-header">
        <div style={{ flex: 1 }}>
          <h3 className="ng-card-name">{result.name}</h3>
          {result.arabicSpelling && (
            <div className="ng-card-arabic" lang="ar" dir="rtl">{result.arabicSpelling}</div>
          )}
          {result.pronunciation && (
            <p className="ng-card-pronunciation">
              <span aria-hidden="true">🔊</span>
              <span aria-label={`Pronunciation: ${result.pronunciation}`}>{result.pronunciation}</span>
            </p>
          )}
        </div>
        <div className="ng-card-badges">
          {genderBadge && (
            <span className={`ng-badge ${genderBadge}`}>
              {result.category}
            </span>
          )}
          {result.isQuranic && <span className="ng-badge ng-badge-quranic">Quranic ✦</span>}
          {result.isSahaba && <span className="ng-badge ng-badge-sahaba">Sahaba</span>}
        </div>
      </div>

      {/* Meaning */}
      {result.meaning && (
        <p className="ng-card-meaning">
          <strong style={{ color: 'var(--ng-text)', fontWeight: 600 }}>Meaning: </strong>
          {result.meaning}
        </p>
      )}

      {/* Urdu meaning */}
      {result.meaningUr && (
        <p className="ng-card-urdu" lang="ur" dir="rtl">
          معنی: {result.meaningUr}
        </p>
      )}

      {/* Tagline */}
      {result.tagline && !result.meaning?.includes(result.tagline) && (
        <div className="ng-card-tagline">💬 {result.tagline}</div>
      )}

      {/* Description */}
      {result.description && result.description !== result.meaning && (
        <p className="ng-card-meaning" style={{ fontSize: '13px' }}>{result.description}</p>
      )}

      {/* Domain / social handle */}
      {(result.domainSuggestion || result.socialHandle) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {result.domainSuggestion && (
            <span className="ng-similar-tag">🌐 {result.domainSuggestion}</span>
          )}
          {result.socialHandle && (
            <span className="ng-similar-tag">📲 {result.socialHandle}</span>
          )}
        </div>
      )}

      {/* Color Palette */}
      {result.colorPalette && result.colorPalette.length > 0 && (
        <div>
          <div className="ng-score-sublabel" style={{ marginBottom: 6 }}>Suggested Color Palette</div>
          <div className="ng-color-palette" role="list">
            {result.colorPalette.map((c) => (
              <div
                key={c}
                className="ng-color-swatch"
                style={{ background: c }}
                role="listitem"
                title={c}
                aria-label={`Color ${c}`}
              />
            ))}
            <span style={{ fontSize: '11px', color: 'var(--ng-text-light)', marginLeft: 4 }}>
              {result.colorPalette.join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Logo Direction */}
      {result.logoDirection && (
        <p className="ng-card-meaning" style={{ fontSize: '12px' }}>
          <strong>Logo Direction:</strong> {result.logoDirection}
        </p>
      )}

      {/* Video Ideas (YouTube) */}
      {result.videoIdeas && result.videoIdeas.length > 0 && (
        <div>
          <div className="ng-score-sublabel" style={{ marginBottom: 6 }}>First 5 Video Ideas</div>
          <div className="ng-video-ideas">
            {result.videoIdeas.map((idea, i) => (
              <div key={i} className="ng-video-idea-item">{idea}</div>
            ))}
          </div>
        </div>
      )}

      {/* Bio suggestion (Instagram) */}
      {result.bioSuggestion && (
        <div className="ng-card-tagline">📝 {result.bioSuggestion}</div>
      )}

      {/* Hashtags (Instagram) */}
      {result.hashtagSuggestions && result.hashtagSuggestions.length > 0 && (
        <div className="ng-hashtags">
          {result.hashtagSuggestions.map((tag) => (
            <span key={tag} className="ng-hashtag">#{tag}</span>
          ))}
        </div>
      )}

      {/* Similar names */}
      {result.similarNames && result.similarNames.length > 0 && (
        <div>
          <div className="ng-score-sublabel" style={{ marginBottom: 6 }}>Similar Names</div>
          <div className="ng-similar">
            {result.similarNames.map((n) => (
              <span key={n} className="ng-similar-tag">{n}</span>
            ))}
          </div>
        </div>
      )}

      {/* Name Score — collapsible */}
      <div>
        <button
          className="ng-action-btn"
          style={{ width: '100%', marginBottom: 8 }}
          onClick={() => setScoreExpanded(p => !p)}
          aria-expanded={scoreExpanded}
          aria-controls={`score-${result.id}`}
        >
          <span>📊</span>
          <span>Name Score: {score.overall}/100</span>
          <span aria-hidden="true" style={{ marginLeft: 'auto' }}>{scoreExpanded ? '▲' : '▼'}</span>
        </button>
        {scoreExpanded && (
          <div id={`score-${result.id}`}>
            <NameScoreCard score={score} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="ng-card-actions">
        <button
          className={`ng-action-btn ${isCopied(result.id) ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label={`Copy ${result.name}`}
          title="Copy to clipboard"
        >
          {isCopied(result.id) ? '✅ Copied!' : '📋 Copy'}
        </button>

        <button
          className={`ng-action-btn ${isFavorite ? 'saved' : ''}`}
          onClick={handleSaveToggle}
          aria-label={isFavorite ? `Remove ${result.name} from favorites` : `Save ${result.name} to favorites`}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          {isFavorite ? '❤️ Saved' : '🤍 Save'}
        </button>

        <button
          className="ng-action-btn"
          onClick={handleShare}
          aria-label={`Share ${result.name}`}
          title="Share this name"
        >
          🔗 Share
        </button>
      </div>
    </article>
  );
}
