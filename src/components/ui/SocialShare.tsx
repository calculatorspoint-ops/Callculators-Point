'use client';
/**
 * src/components/ui/SocialShare.tsx
 * Social share buttons — WhatsApp, Twitter/X, native share, copy link.
 */
import { useState } from 'react';

interface SocialShareProps {
  title: string;
  text?: string;
  url?: string;
}

export function SocialShare({ title, text, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    url ?? (typeof window !== 'undefined' ? window.location.href : '');

  const shareText = text || title;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = getUrl();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} ${getUrl()}`)}`,
      '_blank',
      'noopener,noreferrer'
    );

  const shareToTwitter = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getUrl())}`,
      '_blank',
      'noopener,noreferrer'
    );

  const nativeShare = () =>
    navigator.share?.({ title, text: shareText, url: getUrl() }).catch(() => {});

  const hasNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{
        fontSize: 11, fontWeight: 700, color: 'var(--text3)',
        textTransform: 'uppercase', letterSpacing: '.06em', marginRight: 2,
      }}>
        Share:
      </span>

      {hasNativeShare && (
        <button type="button" onClick={nativeShare} className="share-btn" aria-label="Share via device">
          📤
        </button>
      )}

      <button type="button" onClick={shareToWhatsApp} className="share-btn" aria-label="Share to WhatsApp">
        💬 WhatsApp
      </button>

      <button type="button" onClick={shareToTwitter} className="share-btn" aria-label="Share to Twitter/X">
        𝕏 Twitter
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="share-btn"
        aria-label={copied ? 'Link copied!' : 'Copy page link'}
        style={{ minWidth: 90 }}
      >
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>
    </div>
  );
}
