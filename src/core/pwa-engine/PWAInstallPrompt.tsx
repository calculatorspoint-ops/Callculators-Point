import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstallable(false);
    setDeferredPrompt(null);
  };

  if (!isInstallable || isInstalled || isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in w-[calc(100%-2rem)] max-w-md">
      <div className="bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 ring-1 ring-black/5">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[var(--surface2)] rounded-xl flex items-center justify-center shrink-0 text-xl shadow-inner border border-[var(--border)]">
                📱
            </div>
            <div className="flex flex-col">
            <h4 className="font-bold text-sm">Install Calculators Point Pro</h4>
            <p className="text-xs text-[var(--text2)] font-medium">Access calculators offline anywhere.</p>
            </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-[var(--text)] text-[var(--surface)] px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-colors"
            >
            <Download size={16} />
            Install
            </button>
            <button onClick={() => setIsDismissed(true)} className="p-2 text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] rounded-lg transition-colors">
                <X size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}

