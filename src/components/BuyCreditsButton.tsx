'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Star } from 'lucide-react';

const TIERS = [
  {
    id: 'starter',
    label: 'Starter',
    price: 10,
    credits: 15,
    pricePerCredit: '0.67',
    badge: null,
    priceColor: 'text-neutral-900',
    bg: 'bg-white border-neutral-200 hover:bg-neutral-50',
  },
  {
    id: 'value',
    label: 'Best Value',
    price: 20,
    credits: 40,
    pricePerCredit: '0.50',
    badge: 'Best Value',
    priceColor: 'text-neutral-900',
    bg: 'bg-amber-50 border-amber-300 hover:bg-amber-100',
  },
];

export function BuyCreditsButton({ variant = 'banner' }: { variant?: 'banner' | 'nav' | 'inline' }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (price: number, credits: number) => {
    const tierId = price === 10 ? 'starter' : 'value';
    setLoading(tierId);
    try {
      const res = await fetch('/api/ai/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, credits }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  };

  if (variant === 'nav') {
    return (
      <button
        onClick={() => handleBuy(20, 40)}
        disabled={!!loading}
        className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
      >
        <div className="p-1 rounded-xl">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <span className="text-[10px] font-bold text-amber-600">
          {loading ? '...' : 'Buy Credits'}
        </span>
      </button>
    );
  }

  // Banner / Inline variant — two tier cards side by side
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 text-center">Choose a plan</p>
      <div className="grid grid-cols-2 gap-3">
        {TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => handleBuy(tier.price, tier.credits)}
            disabled={!!loading}
            className={`relative border rounded-2xl p-4 text-left active:scale-95 transition-all shadow-sm ${tier.bg}`}
          >
            {tier.badge && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-2.5 h-2.5" /> {tier.badge}
              </span>
            )}
            <div className="mt-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{tier.label}</p>
              <p className={`text-2xl font-black ${tier.priceColor} leading-tight mt-0.5`}>${tier.price}</p>
              <p className="text-xs font-bold text-neutral-600 mt-1">{tier.credits} Credits</p>
              <p className="text-[9px] text-neutral-400 mt-0.5">${tier.pricePerCredit}/design</p>
            </div>
            {loading === tier.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] text-neutral-400">🔒 Secure one-time payment via Stripe</p>
    </div>
  );
}
