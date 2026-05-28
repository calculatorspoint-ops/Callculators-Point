/**
 * ExportToolbar — PDF & PNG download for calculator results
 *
 * PERFORMANCE FIX: html2canvas (800KB) and jsPDF (500KB) are now
 * dynamically imported ONLY when the user clicks Export/PNG.
 * This removes 151 KiB of JavaScript from the initial bundle load,
 * fixing the "Reduce unused JavaScript" Lighthouse warning.
 */
import React, { useState } from 'react';
import { Download, FileImage, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportToolbarProps {
  targetSelector?: string;
  filenamePrefix?: string;
}

export function ExportToolbar({
  targetSelector = '.calculator-result-zone',
  filenamePrefix = 'Calculators-Point',
}: ExportToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const performExport = async (format: 'pdf' | 'png') => {
    const el = document.querySelector(targetSelector) as HTMLElement;
    if (!el) {
      toast.error('Nothing to export yet. Please calculate a result first.');
      return;
    }

    try {
      setIsExporting(true);
      const toastId = toast.loading(`Generating ${format.toUpperCase()}…`);

      // ── LAZY LOAD the heavy export libraries only on first use ──
      // This keeps them out of the initial JS bundle (saves ~151 KiB)
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      // Hide toolbar itself so it doesn't appear in the exported image
      const toolbar = el.querySelector('.export-toolbar-container') as HTMLElement | null;
      if (toolbar) toolbar.style.display = 'none';

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      if (toolbar) toolbar.style.display = 'flex';

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename  = `${filenamePrefix}_${timestamp}.${format}`;

      if (format === 'png') {
        const link   = document.createElement('a');
        link.download = filename;
        link.href     = canvas.toDataURL('image/png');
        link.click();
      } else {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(filename);
      }

      toast.success(`${format.toUpperCase()} saved successfully!`, { id: toastId });
    } catch (err) {
      toast.error('Failed to generate export file.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-toolbar-container flex gap-2 justify-end mt-4 pt-4 border-t border-[var(--border)]">
      <button
        onClick={() => performExport('png')}
        disabled={isExporting}
        aria-label="Download calculator result as PNG image"
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[var(--text2)] bg-[var(--surface2)] hover:bg-[var(--surface-overlay)] border border-[var(--border)] rounded-md transition-colors disabled:opacity-50"
      >
        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileImage size={14} />}
        PNG
      </button>
      <button
        onClick={() => performExport('pdf')}
        disabled={isExporting}
        aria-label="Download calculator result as PDF report"
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-[var(--brand)] hover:bg-[var(--brand-d)] rounded-md transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        Export PDF
      </button>
    </div>
  );
}
