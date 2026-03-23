"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, Loader2, Sparkles, ChevronLeft, Check, Lock, Share, Flame, UtensilsCrossed, Droplets, Waves, Tent, TreePine } from "lucide-react";
import Link from "next/link";
import { GARDEN_STYLES } from "@/constants/gardenStyles";
import { GARDEN_FEATURES } from "@/constants/gardenFeatures";
import { CompareSlider } from "@/components/CompareSlider";

// Utility to compress image
const compressImage = (dataUrl: string, maxWidth = 1024): Promise<{url: string, ratio: string}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      let ratio = "1:1";
      if (width / height > 1.5) ratio = "16:9";
      else if (height / width > 1.5) ratio = "9:16";
      else if (width / height > 1.2) ratio = "3:2";
      else if (height / width > 1.2) ratio = "2:3";
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve({ url: canvas.toDataURL("image/jpeg", 0.8), ratio });
    };
  });
};

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

      const compressed = await compressImage(selectedImage!);
      const featurePrompts = selectedFeatures.map(fid => GARDEN_FEATURES.find(f => f.id === fid)?.prompt).filter(Boolean);

      const response = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: compressed.url,
          styleId: selectedStyleId,
          stylePrompt: finalStylePrompt,
          features: featurePrompts,
          aspectRatio: compressed.ratio
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
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans pb-32 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200 px-4 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <Link href="/app/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-all text-neutral-500 shadow-sm">
                <ChevronLeft className="w-5 h-5" />
             </Link>
             <div>
                <h1 className="font-bold text-base tracking-tight text-neutral-900">Garden AI</h1>
                <p className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] font-bold">{step}</p>
             </div>
          </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-10">
          <AnimatePresence mode="wait">
            {authStatus === "authorized" && step === "upload" && (
                <motion.div key="upload" className="space-y-6">
                    <div className="bg-white border border-neutral-100 p-8 rounded-3xl text-center shadow-sm">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-neutral-900">Garden Vision</h2>
                        <p className="text-neutral-500 text-sm leading-relaxed">Upload a photo of your outdoor space and let AI transform it.</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" id="garden-upload" onChange={handleFileChange} />
                    <label htmlFor="garden-upload" className="w-full bg-black text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 cursor-pointer hover:bg-neutral-800 active:scale-95 transition-all shadow-lg">
                        <Camera className="w-5 h-5" /> Take or Upload Photo
                    </label>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "style" && (
                <motion.div key="style" className="space-y-5">
                    <div className="space-y-1">
                        <h2 className="font-bold text-xl text-neutral-900">Select Style</h2>
                        <p className="text-neutral-500 text-xs">Choose your garden direction</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {GARDEN_STYLES.map(style => (
                            <button
                                key={style.id}
                                onClick={() => { setSelectedStyleId(style.id); setStep("features"); }}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:scale-[1.02] transition-all duration-300"
                            >
                                <img src={style.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-8">
                                    <span className="text-white text-[10px] font-bold leading-tight block">{style.nameKey}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "features" && (
                <motion.div key="features" className="space-y-5 pb-28">
                    <div className="space-y-1">
                        <h2 className="font-bold text-xl text-neutral-900">Enhancements</h2>
                        <p className="text-neutral-500 text-xs">Select optional features to add</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {GARDEN_FEATURES.map(f => {
                            if (!f) return null;
                            const Icon = f.icon;
                            const isSelected = selectedFeatures.includes(f.id);
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => toggleFeature(f.id)}
                                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 active:scale-[1.02] ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-neutral-100 bg-white hover:border-neutral-200'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wide text-center ${isSelected ? 'text-blue-700' : 'text-neutral-500'}`}>{f.label}</span>
                                    {isSelected && (
                                        <motion.div layoutId="active-dot" className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 p-3 z-50">
                        {error && <div className="text-red-500 text-xs text-center mb-2 bg-red-50 py-1.5 rounded-xl">{error}</div>}
                        <button
                            onClick={handleGenerate}
                            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 shadow-xl transition-all"
                        >
                            <Sparkles className="w-5 h-5 text-yellow-400" /> Generate (1 Credit)
                        </button>
                    </div>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "processing" && (
                <div className="text-center py-24 space-y-6">
                    <div className="w-20 h-20 mb-2 relative mx-auto">
                        <div className="absolute inset-0 rounded-[1.5rem] border-4 border-neutral-200" />
                        <div className="absolute inset-0 rounded-[1.5rem] border-4 border-black border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-black animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">Transforming Garden...</h2>
                        <p className="text-sm text-neutral-500 mt-1">AI is crafting your outdoor space. 15–30 seconds.</p>
                    </div>
                </div>
            )}

            {authStatus === "authorized" && step === "result" && resultImage && (
                <div className="space-y-5 pb-10">
                    <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                        <CompareSlider originalImage={selectedImage!} resultImage={resultImage} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <a href={resultImage} download className="bg-black text-white py-3.5 rounded-2xl font-bold text-sm text-center shadow-md hover:bg-neutral-800 active:scale-95 transition-all">Download</a>
                        <button onClick={() => setStep('upload')} className="bg-white border border-neutral-200 text-neutral-800 py-3.5 rounded-2xl font-bold text-sm hover:bg-neutral-50 transition-all active:scale-95">New Photo</button>
                    </div>
                </div>
            )}
          </AnimatePresence>
      </main>
    </div>
  );
}
