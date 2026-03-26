'use client';

import React, { useEffect, useState } from 'react';
import { Share, MonitorSmartphone } from 'lucide-react';

export function PwaInstallBanner() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Already installed as PWA — hide banner
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIos(true);
    }

    // Works on Desktop Chrome, Edge, and Android Chrome
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  // Hide if already installed as PWA
  if (isInstalled) return null;

  return (
    <div className="w-full bg-white border border-neutral-200 shadow-sm rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/icon.png" alt="App" className="w-full h-full object-cover p-1" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Add to Home Screen</p>
          {isIos ? (
            <p className="text-[9px] text-neutral-500 leading-tight">
              Tap <Share className="w-2.5 h-2.5 inline text-blue-500" /> → "Add to Home Screen"
            </p>
          ) : (
            <p className="text-[9px] text-neutral-500">Install app for the best experience</p>
          )}
        </div>
      </div>

      {!isIos && (
        <button
          onClick={handleInstall}
          disabled={!deferredPrompt}
          className="px-3 py-1.5 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-wider active:scale-95 transition-all shrink-0 disabled:opacity-40"
        >
          Install
        </button>
      )}
    </div>
  );
}
