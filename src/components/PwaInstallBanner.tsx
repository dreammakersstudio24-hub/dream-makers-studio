'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

export function PwaInstallBanner() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if dismissed
    if (localStorage.getItem('pwa-banner-dismissed')) return;

    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
      setShow(true);
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShow(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (platform === 'android' && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/icon.png" alt="App" className="w-full h-full object-cover p-1" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-white uppercase tracking-wider">Install App</p>
          {platform === 'ios' ? (
            <p className="text-[9px] text-white/40 leading-tight">
              Tap <Share className="w-2.5 h-2.5 inline text-blue-400" /> then "Add to Home Screen"
            </p>
          ) : (
            <p className="text-[9px] text-white/40">Add to home screen for best experience</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {platform === 'android' && (
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-wider active:scale-95 transition-all"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
