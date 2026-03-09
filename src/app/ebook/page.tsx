"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

const CHAPTERS = [
  "Foundation: Understanding Space & Light",
  "Color Theory for Luxury Interiors",
  "Furniture Selection & Scale",
  "Textures, Materials & Finishes",
  "Lighting Design masterclass",
  "Styling & The Final Polish",
];

const FEATURES = [
  "50+ Pages of actionable advice",
  "Room-by-room design checklists",
  "Exclusive vendor & sourcing list",
  "Budget planning templates",
];

export default function EBookPage() {
  const handleBuy = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment initialization failed.");
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong initializing checkout.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-40">
        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm tracking-widest uppercase">Back to Home</span>
        </Link>
        <div className="text-xl font-light tracking-widest uppercase">E-Book</div>
        <div className="w-24" /> {/* Spacer */}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="aspect-[3/4] rounded-3xl bg-neutral-900 border border-white/10 relative overflow-hidden flex items-center justify-center p-10">
              {/* E-book Mockup Placeholder */}
              <div className="w-full h-full border border-white/20 bg-black shadow-2xl flex flex-col items-center justify-center p-8 text-center relative z-10 hover:scale-105 transition-transform duration-700">
                <div className="text-sm tracking-widest text-neutral-400 mb-8 uppercase">The Ultimate Guide</div>
                <h1 className="text-4xl lg:text-5xl font-light mb-8 font-serif leading-tight">Mastering<br/>Interior<br/>Design</h1>
                <div className="mt-auto border-t border-white/20 pt-6 w-full text-xs tracking-widest text-neutral-500 uppercase">
                  Dream Makers Studio
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
            </div>
            
            <div className="flex gap-4 p-6 bg-neutral-900/50 rounded-2xl border border-white/5">
              <div className="text-4xl font-light">4.9/5</div>
              <div>
                <div className="flex text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <div className="text-sm text-neutral-400 tracking-widest uppercase">2,000+ Reviews</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Copy & Checkout CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs tracking-widest uppercase mb-6 bg-white/5">
              Digital Download
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-6">
              Transform Your Space Into a Masterpiece
            </h1>
            
            <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
              Stop guessing and start designing. Learn the exact framework we use to elevate ordinary rooms into extraordinary luxury experiences.
            </p>

            <div className="space-y-4 mb-10">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-neutral-500" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 mb-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex items-end gap-4 mb-6">
                <span className="text-5xl font-light">$29</span>
                <span className="text-neutral-500 line-through mb-1">$99 value</span>
              </div>
              
              <button 
                onClick={handleBuy}
                className="w-full bg-white text-black py-4 rounded-full text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group"
              >
                Buy Now 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-neutral-500 mt-4 tracking-widest uppercase">Secure Checkout with Stripe</p>
            </div>

            {/* Chapters */}
            <div>
              <h3 className="text-xl font-light mb-6">What's Inside</h3>
              <div className="space-y-1">
                {CHAPTERS.map((chapter, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors cursor-default">
                    <span className="text-neutral-500 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-neutral-300">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}
