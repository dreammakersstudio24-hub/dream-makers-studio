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

  // Only show on AI App related pages, EXCLUDING the sales landing page
  const isSalesPage = pathname === '/app';
  const isAppPage = (pathname?.startsWith('/app') || pathname?.startsWith('/ai-redesign')) && !isSalesPage;

  useEffect(() => {
    // Reset session visibility if entering sales page (indicates a new flow or logout/login)
    if (isSalesPage) {
        sessionStorage.removeItem('pwa-popup-this-session');
    }

    if (!isAppPage) {
      setShowInstall(false);
      return;
    }

    // Check if shown in THIS session
    const hasShownInSession = sessionStorage.getItem('pwa-popup-this-session');
    if (hasShownInSession) {
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
      sessionStorage.setItem('pwa-popup-this-session', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS guide after a short delay if not installed
    if (/iphone|ipad|ipod/.test(userAgent)) {
      const hasShownGuide = localStorage.getItem('pwa-guide-shown');
      if (!hasShownGuide) {
        setTimeout(() => {
            setShowInstall(true);
            sessionStorage.setItem('pwa-popup-this-session', 'true');
        }, 3000);
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
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] w-[95%] max-w-[340px]"
        >
          <div className="bg-[#1a1d23]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/icon.png" alt="App Icon" className="w-full h-full object-cover p-1.5" />
                </div>
                <div>
                    <h3 className="font-black text-white uppercase tracking-tighter text-[10px]">Studio AI App</h3>
                    <p className="text-[7px] text-white/30 uppercase tracking-[0.2em] font-bold">Elite Performance</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                  onClick={platform === 'ios' ? () => {} : handleAndroidInstall}
                  className="px-4 py-2 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-wider hover:scale-105 transition-all active:scale-95 whitespace-nowrap"
                >
                  {platform === 'ios' ? 'How to Install' : 'Install'}
                </button>
                <button 
                  onClick={closeGuide}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
            </div>
          </div>

          {/* iOS Mini Guide tooltip inside the float if clicked? No, let's keep it simple. */}
          {platform === 'ios' && (
              <div className="mt-2 text-center">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20 animate-pulse">
                    Tap Share <Share className="w-2 h-2 inline text-blue-400" /> then "Add to Home Screen"
                  </p>
              </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
