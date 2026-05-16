import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportToolbarProps {
  targetSelector?: string;
  filenamePrefix?: string;
}

export function ExportToolbar({ targetSelector = '.calculator-result-zone', filenamePrefix = 'CalculatorsPoint' }: ExportToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const performExport = async (format: 'pdf' | 'png') => {
    const el = document.querySelector(targetSelector) as HTMLElement;
    if (!el) {
      toast.error("Nothing to export yet. Please calculate a result first.");
      return;
    }

    try {
      setIsExporting(true);
      const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);

      // Hide export toolbar during capture to avoid self-referential export
      const toolbar = el.querySelector('.export-toolbar-container');
      if (toolbar) (toolbar as HTMLElement).style.display = 'none';

      // Use html2canvas to render the DOM to a canvas
      const canvas = await html2canvas(el, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      if (toolbar) (toolbar as HTMLElement).style.display = 'flex';

      const timestamp = new Date().toISOString().slice(0,10);
      const filename = `${filenamePrefix}_${timestamp}.${format}`;

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // PDF Export
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(filename);
      }

      toast.success(`${format.toUpperCase()} saved successfully!`, { id: toastId });
    } catch (err) {
      console.error("Export failed", err);
      toast.error("Failed to generate export file.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-toolbar-container flex gap-2 justify-end mt-4 pt-4 border-t border-[var(--border)]">
      <button 
        onClick={() => performExport('png')} 
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[var(--text2)] bg-[var(--surface2)] hover:bg-[var(--surface-overlay)] border border-[var(--border)] rounded-md transition-colors disabled:opacity-50"
        title="Download Image"
      >
        <FileImage size={14} /> PNG
      </button>
      <button 
        onClick={() => performExport('pdf')} 
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-[var(--brand)] hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
        title="Download PDF Report"
      >
        <Download size={14} /> Export PDF
      </button>
    </div>
  );
}
