'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export function BuyCreditsButton({ variant = 'banner' }: { variant?: 'banner' | 'nav' }) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  if (variant === 'nav') {
    return (
      <button onClick={handleBuy} disabled={loading} className="flex flex-col items-center gap-1 group active:scale-95 transition-transform">
        <div className="p-1 rounded-xl">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <span className="text-[10px] font-bold text-amber-600">
          {loading ? '...' : 'Buy Credits'}
        </span>
      </button>
    );
  }

  // Banner variant — shown when credits = 0
  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-amber-50 border border-amber-200 rounded-3xl p-5 text-left active:scale-[0.98] transition-all hover:bg-amber-100 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-sm text-neutral-900 leading-tight">Get 40 AI Credits</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Start designing your dream space</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          {loading ? (
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          ) : (
            <>
              <p className="font-black text-base text-neutral-900">$20</p>
              <p className="text-[10px] text-neutral-400">one-time</p>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
