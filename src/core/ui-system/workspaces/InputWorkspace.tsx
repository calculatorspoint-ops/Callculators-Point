import React, { ReactNode } from 'react';

export function InputWorkspace({ children }: { children: ReactNode }) {
  return (
    <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 w-full">
      <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col gap-5 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
