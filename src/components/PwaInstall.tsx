'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PwaInstall() {
  const pathname = usePathname();
  const [showInstall, setShowInstall] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Only show on AI App related pages
  const isAppPage = pathname?.startsWith('/app') || pathname?.startsWith('/ai-redesign');

  useEffect(() => {
    if (!isAppPage) {
      setShowInstall(false);
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Identify platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('other');
    }

    // Android/Chrome install prompt handler
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS guide after a short delay if not installed
    if (/iphone|ipad|ipod/.test(userAgent)) {
      const hasShownGuide = localStorage.getItem('pwa-guide-shown');
      if (!hasShownGuide) {
        setTimeout(() => setShowInstall(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isAppPage]);

  if (!isAppPage) return null;

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  const closeGuide = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-guide-shown', 'true');
  };

  return (
    <AnimatePresence>
      {showInstall && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src="/icon.png" alt="App Icon" className="w-full h-full object-cover p-2" />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-tighter text-lg">Studio AI</h3>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-black">Elite Visionary App</p>
                </div>
              </div>
              <button 
                onClick={closeGuide}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {platform === 'ios' ? (
              <div className="space-y-4 pb-2">
                <p className="text-xs text-white/40 leading-relaxed font-medium uppercase tracking-tight">
                  Integrate this architectural instrument into your iPhone for an immersive experience:
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider text-white/60 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"><Share className="w-4 h-4 text-blue-400" /></div>
                    <span>1. Tap "Share" in Safari</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider text-white/60 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"><PlusSquare className="w-4 h-4 text-white" /></div>
                    <span>2. Add to Home Screen</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xs text-white/40 leading-relaxed font-medium uppercase tracking-tight">
                  Acquire the Studio AI application for full-screen synthesis and seamless access.
                </p>
                <button 
                  onClick={handleAndroidInstall}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl shadow-white/5"
                >
                  <Download className="w-4 h-4" /> Install Application
                </button>
              </div>
            )}

            <div className="pt-2 flex justify-center text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">
              Dream Makers Studio © 2026
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
