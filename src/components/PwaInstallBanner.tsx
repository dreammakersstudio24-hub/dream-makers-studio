'use client';

import React, { useEffect, useState } from 'react';
import { Share } from 'lucide-react';

export function PwaInstallBanner() {
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA — hide
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  // Hide if installed or on unsupported platform
  if (isInstalled || !platform) return null;

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/icon.png" alt="App" className="w-full h-full object-cover p-1" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-white uppercase tracking-wider">Add to Home Screen</p>
          {platform === 'ios' ? (
            <p className="text-[9px] text-white/40 leading-tight">
              Tap <Share className="w-2.5 h-2.5 inline text-blue-400" /> → "Add to Home Screen"
            </p>
          ) : (
            <p className="text-[9px] text-white/40">Install for the best experience</p>
          )}
        </div>
      </div>

      {platform === 'android' && (
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-wider active:scale-95 transition-all shrink-0"
        >
          Install
        </button>
      )}
    </div>
  );
}
