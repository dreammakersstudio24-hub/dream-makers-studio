"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Star, ExternalLink, Download, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Small Backyard Designs",
  "Garden Pathways",
  "Water Features",
  "Fire Pit Lounge",
  "Luxury Garden Spaces",
  "Tropical & Resort Gardens",
];

const FEATURES = [
  "50 ready-to-use AI prompts",
  "Organized into 6 backyard design categories",
  "Realistic residential garden scenes",
  "Style Keywords Cheat Sheet",
  "Bonus tips for better AI images",
];

import { Suspense } from "react";

function EBookClient() {
  const searchParams = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && !isDownloading) {
      handleDownload(sessionId);
    }
  }, [sessionId]);

  const handleDownload = async (sid: string) => {
    setIsDownloading(true);
    setDownloadError("");
    try {
      const res = await fetch(`/api/download?session_id=${sid}`);
      if (!res.ok) throw new Error("Verification failed or session expired.");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "50 Cinematic AI Prompts for Stunning Backyard & Garden Designs.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } catch (e: any) {
      console.error(e);
      setDownloadError(e.message || "Failed to download the E-Book. Please contact support.");
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm mb-10 relative overflow-hidden">
      <div className="flex items-end gap-4 mb-6">
        <span className="text-5xl font-light text-neutral-900">$12.99</span>
        <span className="text-neutral-400 line-through mb-1 font-medium">$99 value</span>
      </div>
      
      {downloadError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center font-medium border border-red-100">
          {downloadError}
        </div>
      )}
      
      {isDownloading ? (
        <div className="w-full bg-blue-50 text-blue-700 py-4 rounded-full text-sm tracking-widest font-bold shadow-inner flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          Preparing your Download...
        </div>
      ) : (
        <button 
          onClick={sessionId ? () => handleDownload(sessionId) : handleBuy}
          disabled={isDownloading}
          className="w-full bg-blue-900 text-white font-medium py-4 px-6 rounded-full hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-75 flex items-center justify-center gap-2 text-base tracking-widest font-bold group"
        >
          {sessionId ? (
             <><Download className="w-5 h-5" /> Download Your Copy Now</>
          ) : (
             <>Buy Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      )}

      <p className="text-center text-xs text-neutral-400 mt-4 tracking-widest uppercase font-medium">Secure Checkout with Stripe</p>
    </div>
  );
}

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
    <div className="min-h-screen bg-stone-50 text-neutral-900 selection:bg-blue-100">
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            {/* Real Book Cover */}
            <div className="rounded-2xl shadow-xl overflow-hidden border border-neutral-100 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/api/ebook-cover"
                alt="50 Cinematic AI Prompts for Stunning Backyard & Garden Designs - Cover"
                className="w-full h-auto block group-hover:scale-110 transition-transform duration-[2s]"
              />
            </div>
            
            <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex gap-4">
                <div className="text-4xl font-bold text-neutral-900 tracking-tight">4.9</div>
                <div>
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-[10px] text-neutral-500 tracking-widest uppercase font-bold">2,000+ Readers</div>
                </div>
              </div>
              <div className="h-10 w-px bg-neutral-200" />
              <div className="text-blue-600 font-bold tracking-wider text-[10px] uppercase">Bestseller</div>
            </div>
          </motion.div>

          {/* Right Column: Copy & Checkout CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-2 rounded-full border border-neutral-200 bg-white text-[10px] font-bold text-neutral-500 tracking-wider uppercase mb-6">
              Digital E-Book
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-neutral-900 tracking-tight">
              The AI Design Bible
            </h1>
            
            <p className="text-neutral-500 text-base font-medium leading-relaxed mb-8">
              50 expert AI prompts for garden and outdoor design — from our lead designers to your home.
            </p>

            <div className="space-y-3 mb-10">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-neutral-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

          <Suspense fallback={
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 mb-12 w-full animate-pulse">
              <div className="h-14 bg-white/5 rounded-2xl mb-8 w-1/3"></div>
              <div className="h-16 bg-white/10 rounded-full w-full"></div>
            </div>
          }>
            <EBookClient />
          </Suspense>

            <div>
              <h3 className="text-xs font-bold tracking-widest text-neutral-500 uppercase mb-4">Contents</h3>
              <div className="space-y-1">
                {CATEGORIES.map((category, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-neutral-100 last:border-0 px-2 rounded-xl hover:bg-neutral-50 transition-all cursor-default group">
                    <span className="text-blue-600 font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-neutral-700 font-medium text-sm group-hover:text-neutral-900 transition-colors">{category}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

        {/* Inspirational Gallery Section */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="mt-40 pt-20 border-t border-white/5"
        >
           <h2 className="text-3xl font-bold mb-3 text-center text-neutral-900 tracking-tight">Sample Gallery</h2>
           <p className="text-neutral-500 text-center mb-10 max-w-2xl mx-auto text-sm">
             A preview of the stunning AI garden renders you can create with our prompts.
           </p>

           <div className="max-w-5xl mx-auto columns-1 md:columns-2 gap-8">
             {/* eslint-disable @next/next/no-img-element */}
             <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-100 group mb-4 hover:shadow-lg transition-all break-inside-avoid bg-neutral-100">
               <img src="/Ebook/Backyard_garden_with_fire_pit_a060186c13.jpeg" alt="Fire Pit Lounge" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-[2s]" />
             </div>
             <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-100 group mb-4 hover:shadow-lg transition-all break-inside-avoid bg-neutral-100">
               <img src="/Ebook/Backyard_with_pergola_lounge_area_1c36a9fc5b.jpeg" alt="Pergola Lounge Area" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-[2s]" />
             </div>
             <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-100 group mb-4 hover:shadow-lg transition-all break-inside-avoid bg-neutral-100">
               <img src="/Ebook/Modern_house_courtyard_backyard_with_stone_patio_f_c2b067f9dc.jpeg" alt="Modern Stone Patio" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-[2s]" />
             </div>
             <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-100 group mb-4 hover:shadow-lg transition-all break-inside-avoid bg-neutral-100">
               <img src="/Ebook/Backyard_garden_with_koi_pond_36d3c2a2ae.jpeg" alt="Koi Pond Oasis" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-[2s]" />
             </div>
             {/* eslint-enable @next/next/no-img-element */}
           </div>
        </motion.div>

        {/* Recommended Tools Affiliate Section */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="mt-40 pt-20 border-t border-white/5"
        >
           <h2 className="text-3xl font-bold mb-3 text-center text-neutral-900 tracking-tight">Recommended Tools</h2>
           <p className="text-neutral-500 text-center mb-10 max-w-2xl mx-auto text-sm">
             Professional software used by our studio designers.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "SketchUp Pro", role: "3D Design", desc: "Core tool for precision architectural modeling.", link: "#" },
                { name: "Midjourney", role: "AI Concept Art", desc: "Rapid ideation and atmospheric mood boarding.", link: "#" },
                { name: "Canva Pro", role: "Mood Boards", desc: "Create beautiful design portfolios and presentations.", link: "#" },
              ].map((tool, i) => (
                <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className="bg-white border border-neutral-100 shadow-sm hover:shadow-md rounded-2xl p-6 block transition-all hover:-translate-y-1 group">
                   <div className="flex items-center justify-between mb-2">
                     <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                     <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                   </div>
                   <div className="text-[10px] text-blue-600 font-bold tracking-widest uppercase mb-3">{tool.role}</div>
                   <p className="text-sm text-neutral-500 leading-relaxed">{tool.desc}</p>
                </a>
              ))}
           </div>
        </motion.div>
      </main>
    </div>
  );
}
