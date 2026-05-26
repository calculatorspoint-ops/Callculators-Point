'use client';
import { useState } from 'react';
import type { FavoriteItem } from '@/hooks/name-generators/useFavorites';
import { useClipboard } from '@/hooks/name-generators/useClipboard';

interface FavoriteListProps {
  favorites: FavoriteItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onExportCSV: () => void;
  toolName: string;
}

export function FavoriteList({
  favorites,
  isOpen,
  onClose,
  onRemove,
  onClear,
  onExportCSV,
  toolName,
}: FavoriteListProps) {
  const { copy, isCopied } = useClipboard();
  const [printMode, setPrintMode] = useState(false);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="ng-drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="ng-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Saved names"
        id="favorites-drawer"
      >
        <div className="ng-drawer-header">
          <h2 className="ng-drawer-title">
            ❤️ Saved Names
            {favorites.length > 0 && (
              <span style={{
                marginLeft: 8,
                background: 'var(--ng-accent-1)',
                color: 'white',
                borderRadius: '100px',
                padding: '2px 10px',
                fontSize: '13px',
                fontWeight: 700,
              }}>
                {favorites.length}
              </span>
            )}
          </h2>
          <button
            className="ng-drawer-close"
            onClick={onClose}
            aria-label="Close favorites"
          >
            ✕
          </button>
        </div>

        <div className="ng-drawer-body">
          {favorites.length === 0 ? (
            <div className="ng-empty" style={{ padding: '40px 0' }}>
              <div className="ng-empty-icon">💔</div>
              <div className="ng-empty-title">No saved names yet</div>
              <div className="ng-empty-desc">
                Click the 🤍 Save button on any generated name to save it here.
              </div>
            </div>
          ) : (
            <div>
              {favorites.map((fav) => (
                <div key={fav.id} className="ng-fav-item">
                  <div style={{ flex: 1 }}>
                    <div className="ng-fav-name">{fav.name}</div>
                    {fav.meaning && (
                      <div className="ng-fav-meta">{fav.meaning.slice(0, 60)}{fav.meaning.length > 60 ? '...' : ''}</div>
                    )}
                    {fav.tagline && (
                      <div className="ng-fav-meta" style={{ fontStyle: 'italic' }}>"{fav.tagline}"</div>
                    )}
                    <div className="ng-fav-meta">
                      Saved {new Date(fav.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      className="ng-fav-remove"
                      onClick={() => copy(fav.name, fav.id)}
                      aria-label={`Copy ${fav.name}`}
                      title="Copy"
                      style={{ marginRight: 4 }}
                    >
                      {isCopied(fav.id) ? '✅' : '📋'}
                    </button>
                    <button
                      className="ng-fav-remove"
                      onClick={() => onRemove(fav.id)}
                      aria-label={`Remove ${fav.name} from favorites`}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="ng-drawer-footer">
            <button
              className="ng-drawer-btn"
              onClick={onExportCSV}
              aria-label="Export favorites as CSV"
              title="Download as CSV"
            >
              ⬇️ CSV
            </button>
            <button
              className="ng-drawer-btn"
              onClick={handlePrint}
              aria-label="Print favorites"
              title="Print list"
            >
              🖨️ Print
            </button>
            <button
              className="ng-drawer-btn danger"
              onClick={onClear}
              aria-label="Clear all favorites"
              title="Clear all"
            >
              🗑️ Clear
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// FAB button to open favorites
interface FavoritesFABProps {
  count: number;
  onClick: () => void;
  color?: string;
}

export function FavoritesFAB({ count, onClick, color = 'var(--ng-accent-1)' }: FavoritesFABProps) {
  return (
    <button
      className="ng-favorites-fab"
      style={{ background: color }}
      onClick={onClick}
      aria-label={`Open favorites (${count} saved)`}
      aria-controls="favorites-drawer"
      title="View saved names"
    >
      ❤️
      {count > 0 && (
        <span className="ng-fav-count" aria-live="polite" aria-atomic="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
