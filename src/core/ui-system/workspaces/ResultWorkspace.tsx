import React, { ReactNode } from 'react';
import { ExportToolbar } from '../../export-engine/ExportToolbar';

export function ResultWorkspace({ children }: { children: ReactNode }) {
  return (
    <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-6 w-full lg:sticky lg:top-6 self-start pb-8 lg:pb-0 calculator-result-zone relative bg-[var(--surface)]">
      {children}
      <ExportToolbar />
    </div>
  );
}
