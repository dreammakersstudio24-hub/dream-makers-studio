"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, X, Loader2, Sparkles, ChevronLeft, Check, Lock, Share, Flame, UtensilsCrossed, Droplets, Waves, Tent, TreePine } from "lucide-react";
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
      const featurePrompts = selectedFeatures.map(fid => GARDEN_FEATURES.find(f => f.id === fid)?.prompt).filter(Boolean);

      const response = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          stylePrompt: styleInfo?.prompt || "modern garden",
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-32">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/app/dashboard" className="w-10 h-10 flex items-center justify-center bg-neutral-100 rounded-full">
                <ChevronLeft className="w-6 h-6" />
             </Link>
             <h1 className="font-bold text-lg">{step.charAt(0).toUpperCase() + step.slice(1)}</h1>
          </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
          <AnimatePresence mode="wait">
            {authStatus === "authorized" && step === "upload" && (
                <motion.div key="upload" className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 text-center">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Camera className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Upload Space</h2>
                        <p className="text-neutral-500">Take a photo of your garden or backyard.</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" id="garden-upload" onChange={handleFileChange} />
                    <label htmlFor="garden-upload" className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 cursor-pointer">
                        <Camera className="w-6 h-6" /> Take or Upload Photo
                    </label>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "style" && (
                <motion.div key="style" className="space-y-6">
                    <h2 className="font-bold text-xl mb-4">Pick a Garden Style</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {GARDEN_STYLES.map(style => (
                            <button key={style.id} onClick={() => { setSelectedStyleId(style.id); setStep("features"); }} className="relative aspect-square rounded-3xl overflow-hidden border-2 border-transparent">
                                <img src={style.image} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3"><span className="text-white text-xs font-bold">{style.nameKey}</span></div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "features" && (
                <motion.div key="features" className="space-y-6">
                    <h2 className="font-bold text-xl mb-2">Add Luxury Features</h2>
                    <p className="text-sm text-neutral-500 mb-6">Select elements to include in your new garden.</p>
                    <div className="grid grid-cols-2 gap-3">
                        {GARDEN_FEATURES.map(f => {
                            const Icon = f.icon;
                            const isSelected = selectedFeatures.includes(f.id);
                            return (
                                <button key={f.id} onClick={() => toggleFeature(f.id)} className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${isSelected ? 'border-green-600 bg-green-50' : 'border-neutral-100 bg-white'}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-green-600 text-white' : 'bg-neutral-50 text-neutral-400'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold text-center leading-tight">{f.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <button onClick={handleGenerate} className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg mt-8 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" /> Generate Garden
                    </button>
                </motion.div>
            )}

            {authStatus === "authorized" && step === "processing" && (
                <div className="text-center py-20"><Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-neutral-300" /><h2 className="text-xl font-bold">Landscaping in Progress...</h2></div>
            )}

            {authStatus === "authorized" && step === "result" && resultImage && (
                <div className="space-y-6">
                    <CompareSlider originalImage={selectedImage!} resultImage={resultImage} />
                    <div className="grid grid-cols-2 gap-3">
                        <a href={resultImage} download className="bg-black text-white py-4 rounded-2xl font-bold text-center">Download</a>
                        <button onClick={() => setStep('upload')} className="bg-neutral-100 text-neutral-900 py-4 rounded-2xl font-bold">New Project</button>
                    </div>
                </div>
            )}
          </AnimatePresence>
      </main>
    </div>
  );
}
