import React, { ReactNode } from 'react';

export function InputWorkspace({ children }: { children: ReactNode }) {
  return (
    <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 w-full">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-5 transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}
