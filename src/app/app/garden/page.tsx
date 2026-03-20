"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, Loader2, Sparkles, ChevronLeft, Check, Lock, Share, Flame, UtensilsCrossed, Droplets, Waves, Tent, TreePine } from "lucide-react";
import Link from "next/link";
import { GARDEN_STYLES } from "@/constants/gardenStyles";
import { GARDEN_FEATURES } from "@/constants/gardenFeatures";
import { CompareSlider } from "@/components/CompareSlider";

export default function GardenGeneratePage() {
  const [step, setStep] = useState<"upload" | "style" | "features" | "processing" | "result">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "authorized" | "not_logged_in" | "no_credits">("loading");

  useEffect(() => {
    fetch('/api/user/ai-access')
      .then(res => res.json())
      .then(data => {
        if (!data.authorized) setAuthStatus(data.reason === "NO_CREDITS" ? "no_credits" : "not_logged_in");
        else setAuthStatus("authorized");
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setStep("style");
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!selectedStyleId || !selectedImage) return;
    setStep("processing");
    try {
      const styleInfo = GARDEN_STYLES.find(s => s.id === selectedStyleId);
      
      // Select a random prompt from the variations to ensure diversity (E-book enhancement)
      let finalStylePrompt = "modern garden";
      if (styleInfo) {
        if (styleInfo.prompts && styleInfo.prompts.length > 0) {
          const randomIndex = Math.floor(Math.random() * styleInfo.prompts.length);
          finalStylePrompt = styleInfo.prompts[randomIndex];
        }
      }

      const featurePrompts = selectedFeatures.map(fid => GARDEN_FEATURES.find(f => f.id === fid)?.prompt).filter(Boolean);

      const response = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          stylePrompt: finalStylePrompt,
          features: featurePrompts
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");
      
      setResultImage(data.resultUrl);
      setStep("result");
    } catch (err: any) {
      setError(err.message);
      setStep("features");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans pb-32 selection:bg-white/10 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#0f1115]/80 backdrop-blur-xl border-b border-white/5 px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/app/dashboard" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
                <ChevronLeft className="w-6 h-6" />
             </Link>
             <div>
                <h1 className="font-black uppercase tracking-tighter text-xl leading-none">Garden AI</h1>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-black">{step}</p>
             </div>
          </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-10">
          <AnimatePresence mode="wait">
            {authStatus === "authorized" && step === "upload" && (
                <motion.div key="upload" className="space-y-12">
                    <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="w-24 h-24 bg-white/5 border border-white/10 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-all duration-500">
                            <Camera className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Garden Vision</h2>
                        <p className="text-white/30 text-xs font-medium uppercase tracking-tight leading-relaxed">Let our AI synthesize a luxury landscape from your existing outdoor space.</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" id="garden-upload" onChange={handleFileChange} />
                    <label htmlFor="garden-upload" className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 cursor-pointer shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all">
                        <Sparkles className="w-5 h-5" /> Take or Upload Space
                    </label>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "style" && (
                <motion.div key="style" className="space-y-10">
                    <div className="space-y-2">
                        <h2 className="font-black uppercase tracking-tighter text-3xl text-white">Select Style</h2>
                        <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black italic">Architectural Direction</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {GARDEN_STYLES.map(style => (
                            <button 
                                key={style.id} 
                                onClick={() => { setSelectedStyleId(style.id); setStep("features"); }} 
                                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl hover:scale-[1.03] transition-all duration-500"
                            >
                                <img src={style.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 pt-12">
                                    <span className="text-white text-[11px] font-black uppercase tracking-[0.2em] leading-tight block truncate group-hover:text-blue-400 transition-colors">{style.nameKey}</span>
                                </div>
                                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-[2rem] transition-all pointer-events-none" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "features" && (
                <motion.div key="features" className="space-y-10">
                    <div className="space-y-2">
                        <h2 className="font-black uppercase tracking-tighter text-3xl text-white">Enhancements</h2>
                        <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black italic">Synthesize Assets</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {GARDEN_FEATURES.map(f => {
                            if (!f) return null;
                            const Icon = f.icon;
                            const isSelected = selectedFeatures.includes(f.id);
                            return (
                                <button 
                                    key={f.id} 
                                    onClick={() => toggleFeature(f.id)} 
                                    className={`relative p-6 rounded-[2.5rem] border transition-all duration-700 flex flex-col items-center gap-4 group ${isSelected ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-blue-500 text-white shadow-[0_10px_30px_rgba(59,130,246,0.5)] scale-110' : 'bg-white/5 text-white/30 group-hover:text-white/60'}`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight transition-colors ${isSelected ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>{f.label}</span>
                                    {isSelected && (
                                        <motion.div layoutId="active-dot" className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] ring-2 ring-blue-500/20" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            onClick={handleGenerate} 
                            className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            <Sparkles className="w-5 h-5 text-blue-500" /> 
                            <span>Synthesize Masterpiece</span>
                        </button>
                    </div>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "processing" && (
                <div className="text-center py-40 space-y-8">
                    <div className="relative w-24 h-24 mx-auto">
                        <Loader2 className="w-full h-full animate-spin text-white/10" />
                        <Sparkles className="absolute inset-0 w-8 h-8 m-auto text-white animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Synthesizing...</h2>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black mt-2">Crafting your luxury oasis</p>
                    </div>
                </div>
            )}

            {authStatus === "authorized" && step === "result" && resultImage && (
                <div className="space-y-12">
                    <div className="rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                        <CompareSlider originalImage={selectedImage!} resultImage={resultImage} />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <a href={resultImage} download className="bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center shadow-xl hover:scale-105 transition-all active:scale-95">Download</a>
                        <button onClick={() => setStep('upload')} className="bg-white/5 border border-white/10 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">New Project</button>
                    </div>
                </div>
            )}
          </AnimatePresence>
      </main>
    </div>
  );
}
