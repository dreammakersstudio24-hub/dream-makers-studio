'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PwaInstall() {
  const [showInstall, setShowInstall] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
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
  }, []);

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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center overflow-hidden">
                  <img src="/icon.png" alt="App Icon" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">Install Studio AI</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Official Application</p>
                </div>
              </div>
              <button 
                onClick={closeGuide}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {platform === 'ios' ? (
              <div className="space-y-3 pb-2">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Install this app on your iPhone for the best experience:
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-neutral-700 bg-neutral-50 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"><Share className="w-4 h-4 text-blue-500" /></div>
                    <span>1. Tap "Share" in Safari</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-neutral-700 bg-neutral-50 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"><PlusSquare className="w-4 h-4" /></div>
                    <span>2. Select "Add to Home Screen"</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Add Studio AI to your home screen for quick access and a full-screen experience.
                </p>
                <button 
                  onClick={handleAndroidInstall}
                  className="w-full bg-black text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                >
                  <Download className="w-5 h-5" /> Install App
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
