"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Star, ExternalLink, Download, Loader2 } from "lucide-react";

const CHAPTERS = [
  "How to Use the AI Prompt System",
  "Small Backyard Designs (Prompts 1-10)",
  "Garden Pathways & Walkways",
  "Water Features & Reflecting Pools",
  "Fire Pit Lounge & Social Spaces",
  "Tropical & Resort Garden Concepts",
  "Bonus Tips for Photo-Realism",
];

const FEATURES = [
  "50 plug-and-play AI prompts",
  "High-res cinematic references",
  "Tips for lighting & camera angles",
  "Optimized for Midjourney V6.1",
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-blue-100 selection:text-blue-900">
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            {/* Real Book Cover */}
            <div className="rounded-2xl shadow-2xl overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/api/ebook-cover"
                alt="50 Cinematic AI Prompts for Stunning Backyard & Garden Designs - Cover"
                className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
            
            <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
              <div className="flex gap-4">
                <div className="text-4xl font-light text-neutral-900">4.9/5</div>
                <div>
                  <div className="flex text-orange-400 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-sm text-neutral-500 tracking-widest uppercase font-medium">2,000+ Reviews</div>
                </div>
              </div>
              <div className="h-8 w-px bg-neutral-100" />
              <div className="text-blue-600 font-bold tracking-tighter text-sm">OFFICIAL RELEASE</div>
            </div>
          </motion.div>

          {/* Right Column: Copy & Checkout CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-200 text-xs font-bold text-blue-700 bg-blue-50 tracking-widest uppercase mb-6">
              Digital Download
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-6 text-neutral-900">
              Generate Stunning Outdoor Concepts in Seconds
            </h1>
            
            <p className="text-lg text-neutral-500 mb-10 leading-relaxed font-light">
              Stop guessing keywords. Discover the exact Midjourney prompts we use to generate photorealistic, cinematic backyard and garden designs that win over high-end clients.
            </p>

            <div className="space-y-4 mb-10">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-neutral-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>

          <Suspense fallback={
            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm mb-10 w-full animate-pulse">
              <div className="h-12 bg-neutral-100 rounded-xl mb-6 w-1/3"></div>
              <div className="h-14 bg-blue-100 rounded-full w-full"></div>
            </div>
          }>
            <EBookClient />
          </Suspense>

          {/* Chapters */}
            <div>
              <h3 className="text-xl font-medium tracking-wide text-neutral-900 mb-6">What's Inside</h3>
              <div className="space-y-1">
                {CHAPTERS.map((chapter, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 px-2 rounded-lg transition-colors cursor-default">
                    <span className="text-blue-500 font-mono font-medium">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-neutral-700 font-medium">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

        {/* Recommended Tools Affiliate Section */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="mt-32 pt-16 border-t border-neutral-200"
        >
           <h2 className="text-3xl font-light mb-2 text-center text-neutral-900">Tools of the Trade</h2>
           <p className="text-neutral-500 text-center mb-12 max-w-xl mx-auto font-light">
             The software and platforms we use daily to create stunning interior designs and 3D renderings.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "SketchUp Pro", role: "3D Modeling", desc: "Our go-to software for precise architectural modeling.", link: "#" },
                { name: "Midjourney", role: "AI Concept Art", desc: "For rapid ideation and mood boarding before finalizing designs.", link: "#" },
                { name: "Canva Pro", role: "Presentations", desc: "How we deliver stunning mood boards to our high-end clients.", link: "#" },
              ].map((tool, i) => (
                <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className="bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-blue-200 rounded-3xl p-8 block transition-all hover:-translate-y-1 group">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                     <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-blue-600 transition-colors" />
                   </div>
                   <div className="text-xs text-orange-500 font-bold tracking-widest uppercase mb-4">{tool.role}</div>
                   <p className="text-sm text-neutral-500 leading-relaxed font-light">{tool.desc}</p>
                </a>
              ))}
           </div>
        </motion.div>
      </main>
    </div>
  );
}
