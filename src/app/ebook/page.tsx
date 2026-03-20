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
    <div className="min-h-screen bg-[#020203] text-white selection:bg-white/10">
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
            <div className="rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden group border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/api/ebook-cover"
                alt="50 Cinematic AI Prompts for Stunning Backyard & Garden Designs - Cover"
                className="w-full h-auto block group-hover:scale-110 transition-transform duration-[2s]"
              />
            </div>
            
            <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-3xl">
              <div className="flex gap-6">
                <div className="text-5xl font-black text-white tracking-tighter">4.9</div>
                <div>
                  <div className="flex text-white mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-[10px] text-white/30 tracking-[0.3em] uppercase font-black">2,000+ Readers</div>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-blue-400 font-black tracking-[0.3em] text-[10px] uppercase">Elite Release</div>
            </div>
          </motion.div>

          {/* Right Column: Copy & Checkout CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-5 py-2 rounded-full border border-white/10 text-[10px] font-black text-white/40 bg-white/5 tracking-[0.3em] uppercase mb-8">
              Digital Manuscript
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8 text-white tracking-tighter uppercase">
              The AI Design Bible
            </h1>
            
            <p className="text-white/40 text-lg font-medium tracking-tight leading-relaxed mb-10">
              Master the art of architectural synthesis. Dream Makers Studio Pro Prompts is a curated collection of 50 elite-tier AI prompts designed to generate hyper-realistic, high-fidelity exterior visions. Direct from our lead designers to your studio.
            </p>

            <div className="space-y-6 mb-12">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-white font-medium">
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-lg tracking-tight">{feature}</span>
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
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase mb-8">Manuscript Contents</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category, i) => (
                  <div key={i} className="flex gap-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 px-4 rounded-2xl transition-all cursor-default group">
                    <span className="text-blue-400 font-black tracking-[0.2em]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-white/60 font-black uppercase tracking-tighter group-hover:text-white transition-colors">{category}</span>
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
           <h2 className="text-4xl md:text-6xl font-black mb-4 text-center text-white tracking-tighter uppercase">Cinematic Synthesis</h2>
           <p className="text-white/30 text-center mb-16 max-w-2xl mx-auto font-medium tracking-tight uppercase text-xs">
             A glimpse into the hyper-realistic architectural renders achievable through our proprietary prompting framework.
           </p>

           <div className="max-w-5xl mx-auto columns-1 md:columns-2 gap-8">
             {/* eslint-disable @next/next/no-img-element */}
             <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group mb-8 hover:border-white/20 transition-all break-inside-avoid bg-black">
               <img src="/Ebook/Backyard_garden_with_fire_pit_a060186c13.jpeg" alt="Fire Pit Lounge" className="w-full h-auto transform group-hover:scale-110 transition-transform duration-[2s]" />
             </div>
             <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group mb-8 hover:border-white/20 transition-all break-inside-avoid bg-black">
               <img src="/Ebook/Backyard_with_pergola_lounge_area_1c36a9fc5b.jpeg" alt="Pergola Lounge Area" className="w-full h-auto transform group-hover:scale-110 transition-transform duration-[2s]" />
             </div>
             <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group mb-8 hover:border-white/20 transition-all break-inside-avoid bg-black">
               <img src="/Ebook/Modern_house_courtyard_backyard_with_stone_patio_f_c2b067f9dc.jpeg" alt="Modern Stone Patio" className="w-full h-auto transform group-hover:scale-110 transition-transform duration-[2s]" />
             </div>
             <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group mb-8 hover:border-white/20 transition-all break-inside-avoid bg-black">
               <img src="/Ebook/Backyard_garden_with_koi_pond_36d3c2a2ae.jpeg" alt="Koi Pond Oasis" className="w-full h-auto transform group-hover:scale-110 transition-transform duration-[2s]" />
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
           <h2 className="text-4xl md:text-6xl font-black mb-4 text-center text-white tracking-tighter uppercase">Professional Arsenal</h2>
           <p className="text-white/30 text-center mb-16 max-w-2xl mx-auto font-medium tracking-tight uppercase text-xs">
             The elite software and platforms utilized by the Studio to architect high-fidelity experiences across the globe.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "SketchUp Pro", role: "3D Synthesis", desc: "Our core framework for high-precision architectural synthesis.", link: "#" },
                { name: "Midjourney", role: "AI Concept Art", desc: "For rapid architectural ideation and atmospheric mood boarding.", link: "#" },
                { name: "Canva Pro", role: "Curated Portfolios", desc: "How we deliver world-class mood boards to our private clientele.", link: "#" },
              ].map((tool, i) => (
                <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 shadow-2xl hover:border-white/30 rounded-[2.5rem] p-10 block transition-all hover:-translate-y-2 group backdrop-blur-3xl">
                   <div className="flex items-center justify-between mb-6">
                     <h3 className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-blue-400 transition-colors leading-tight">{tool.name}</h3>
                     <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                   </div>
                   <div className="text-[10px] text-blue-400 font-black tracking-[0.3em] uppercase mb-6">{tool.role}</div>
                   <p className="text-sm text-white/40 leading-relaxed font-medium tracking-tight">"{tool.desc}"</p>
                </a>
              ))}
           </div>
        </motion.div>
      </main>
    </div>
  );
}
