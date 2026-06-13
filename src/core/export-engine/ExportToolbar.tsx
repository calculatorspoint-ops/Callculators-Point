/**
 * ExportToolbar — PDF & PNG download for every calculator result
 *
 * PERFORMANCE: html2canvas (800KB) and jsPDF (500KB) are lazy-loaded
 * only on first click — zero impact on initial page bundle.
 *
 * TARGET ELEMENT RESOLUTION (priority order):
 *  1. #calc-export-target   (the .calc-card wrapper in calculator-client.tsx)
 *  2. .calc-card            (fallback if ID is missing)
 *  3. .calc-card-body       (inner body as last resort)
 */
'use client';
import React, { useState } from 'react';
import { Download, FileImage, Loader2 } from 'lucide-react';

interface ExportToolbarProps {
  filenamePrefix?: string;
}

/** Resolve the DOM element to capture, with a reliable fallback chain. */
function resolveTarget(): HTMLElement | null {
  return (
    document.getElementById('calc-export-target') ||
    document.querySelector<HTMLElement>('.calc-card') ||
    document.querySelector<HTMLElement>('.calc-card-body')
  );
}

export function ExportToolbar({ filenamePrefix = 'Calculators-Point' }: ExportToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus]           = useState<'idle' | 'ok' | 'err'>('idle');

  const performExport = async (format: 'pdf' | 'png') => {
    const el = resolveTarget();
    if (!el) {
      setStatus('err');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    try {
      setIsExporting(true);
      setStatus('idle');

      // Lazy-load heavy libraries only on first use (~1.3 MB combined)
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      // Hide this toolbar itself so it doesn't appear in the capture
      const toolbar = document.getElementById('calc-export-toolbar');
      if (toolbar) toolbar.style.visibility = 'hidden';

      const canvas = await html2canvas(el, {
        scale: 2,                    // Retina-quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',  // Force white bg — dark mode safe
        logging: false,
        removeContainer: true,
        // Ensure chart SVGs render correctly
        foreignObjectRendering: false,
      });

      if (toolbar) toolbar.style.visibility = 'visible';

      const date      = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const safeName  = filenamePrefix.replace(/[^a-z0-9_\-]/gi, '_');
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename  = `${safeName}_${timestamp}.${format}`;

      if (format === 'png') {
        // ── PNG: create a new canvas with branded header ──────────────
        const header   = 48;
        const out      = document.createElement('canvas');
        out.width      = canvas.width;
        out.height     = canvas.height + header * 2;
        const ctx      = out.getContext('2d')!;

        // White background
        ctx.fillStyle  = '#ffffff';
        ctx.fillRect(0, 0, out.width, out.height);

        // Branded top bar
        ctx.fillStyle  = '#2563EB';
        ctx.fillRect(0, 0, out.width, header * 2);

        ctx.fillStyle  = '#ffffff';
        ctx.font       = `bold ${header * 0.7}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(`📊 ${filenamePrefix}`, header * 0.5, header);

        ctx.font       = `${header * 0.45}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.fillStyle  = 'rgba(255,255,255,0.75)';
        ctx.fillText(`calculatorspoint.com · ${date}`, header * 0.5, header * 1.6);

        // Calculator content below header
        ctx.drawImage(canvas, 0, header * 2);

        const link     = document.createElement('a');
        link.download  = filename;
        link.href      = out.toDataURL('image/png');
        link.click();

      } else {
        // ── PDF: fit to A4 with letterhead ────────────────────────────
        const pageW    = 595;   // A4 pt width
        const pageH    = 842;   // A4 pt height
        const margin   = 28;
        const headerH  = 48;

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

        // Header bar
        pdf.setFillColor(37, 99, 235);
        pdf.rect(0, 0, pageW, headerH, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text(`${filenamePrefix}`, margin, 30);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(200, 220, 255);
        pdf.text(`calculatorspoint.com  ·  ${date}`, margin, 43);

        // Scale the captured canvas to fit the A4 page width
        const usableW  = pageW - margin * 2;
        const ratio    = usableW / canvas.width;
        const imgH     = canvas.height * ratio;
        const imgData  = canvas.toDataURL('image/jpeg', 0.93);

        // If content fits on one page, center it; if taller split across pages
        const yStart   = headerH + margin;
        if (imgH <= pageH - yStart - margin) {
          pdf.addImage(imgData, 'JPEG', margin, yStart, usableW, imgH);
        } else {
          // Multi-page: slice the canvas across A4 pages
          const sliceH = Math.floor((pageH - yStart - margin) / ratio);
          let y = 0;
          let first = true;
          while (y < canvas.height) {
            const slice = document.createElement('canvas');
            slice.width  = canvas.width;
            slice.height = Math.min(sliceH, canvas.height - y);
            const sctx   = slice.getContext('2d')!;
            sctx.drawImage(canvas, 0, -y);
            const sliceData = slice.toDataURL('image/jpeg', 0.93);
            if (!first) {
              pdf.addPage();
              pdf.setFillColor(37, 99, 235);
              pdf.rect(0, 0, pageW, 8, 'F');
            }
            pdf.addImage(sliceData, 'JPEG', margin, first ? yStart : 12, usableW, slice.height * ratio);
            y    += sliceH;
            first = false;
          }
        }

        // Footer
        const lastPage = pdf.getNumberOfPages();
        for (let p = 1; p <= lastPage; p++) {
          pdf.setPage(p);
          pdf.setFontSize(7);
          pdf.setTextColor(148, 163, 184);
          pdf.text('Results are for informational purposes only. Always verify with a qualified professional.', margin, pageH - 10);
        }

        pdf.save(filename);
      }

      setStatus('ok');
      setTimeout(() => setStatus('idle'), 3000);

    } catch (err) {
      console.error('[ExportToolbar] export failed:', err);
      setStatus('err');
      setTimeout(() => setStatus('idle'), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      id="calc-export-toolbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      {/* Status message */}
      {status === 'ok' && (
        <span style={{ fontSize: 12, color: 'var(--green-text, #047857)', fontWeight: 600 }}>
          ✓ Downloaded successfully!
        </span>
      )}
      {status === 'err' && (
        <span style={{ fontSize: 12, color: 'var(--red-d, #b91c1c)', fontWeight: 600 }}>
          ✗ Nothing to export yet — calculate a result first.
        </span>
      )}

      {/* PNG button */}
      <button
        onClick={() => performExport('png')}
        disabled={isExporting}
        aria-label="Download calculator result as PNG image"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text2)',
          background: 'var(--surface2)',
          border: '1.5px solid var(--border)',
          borderRadius: 8,
          cursor: isExporting ? 'wait' : 'pointer',
          opacity: isExporting ? 0.6 : 1,
          transition: 'all .15s',
          fontFamily: 'var(--font)',
          letterSpacing: '.02em',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { if (!isExporting) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
      >
        {isExporting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <FileImage size={13} />}
        PNG
      </button>

      {/* PDF button */}
      <button
        onClick={() => performExport('pdf')}
        disabled={isExporting}
        aria-label="Download calculator result as PDF report"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          background: 'var(--brand, #2563eb)',
          border: '1.5px solid transparent',
          borderRadius: 8,
          cursor: isExporting ? 'wait' : 'pointer',
          opacity: isExporting ? 0.6 : 1,
          transition: 'all .15s',
          fontFamily: 'var(--font)',
          letterSpacing: '.02em',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(37,99,235,.25)',
        }}
        onMouseEnter={e => { if (!isExporting) (e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-d, #1d4ed8)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--brand, #2563eb)'; }}
      >
        {isExporting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={13} />}
        Export PDF
      </button>
    </div>
  );
}
