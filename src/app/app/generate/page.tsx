"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, Loader2, Sparkles, ChevronLeft, Check, Lock, Share, Star } from "lucide-react";
import Link from "next/link";
import { STYLES } from "@/constants/styles";
import { ROOM_TYPES } from "@/constants/roomTypes";
import { CompareSlider } from "@/components/CompareSlider";
import { ShopSimilarFurniture } from "@/components/ShopSimilarFurniture";

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

// Style tier labels
const TIER_LABELS = {
  core: "Core",
  architectural: "Architectural",
  atmosphere: "Atmosphere",
};

export default function MobileGeneratePage() {
  const [step, setStep] = useState<"upload" | "room" | "style" | "processing" | "result">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "authorized" | "not_logged_in" | "no_credits">("loading");

  useEffect(() => {
    fetch('/api/user/ai-access')
      .then(res => res.json())
      .then(data => {
        if (!data.authorized && data.reason === "NOT_LOGGED_IN") setAuthStatus("not_logged_in");
        else if (!data.authorized && data.reason === "NO_CREDITS") setAuthStatus("no_credits");
        else setAuthStatus("authorized");
      })
      .catch(() => setAuthStatus("not_logged_in"));
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setStep("room");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedStyleId || !selectedImage) return;
    setStep("processing");
    setError(null);
    try {
      const compressed = await compressImage(selectedImage);
      const styleInfo = STYLES.find(s => s.id === selectedStyleId);
      const roomInfo = ROOM_TYPES.find(r => r.id === selectedRoomId);

      const response = await fetch("/api/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: compressed.url,
          stylePrompt: styleInfo?.prompt_addon || styleInfo?.nameKey || "modern",
          negativePrompt: styleInfo?.negative_prompt || "",
          roomType: roomInfo?.nameKey || "room",
          aspectRatio: compressed.ratio,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");

      setResultImage(data.resultUrl);
      setStep("result");
    } catch (err: any) {
      setError(err.message || "Error occurred.");
      setStep("style");
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `redesign-${selectedStyleId}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {}
  };

  const shareDesign = async () => {
    if (navigator.share && resultImage) {
      try {
        await navigator.share({
          title: 'My AI Room Transformation',
          text: 'Check out my new room designed with Dream Makers Studio AI!',
          url: resultImage,
        });
      } catch {}
    }
  };

  // Group styles by tier
  const tierOrder = ["core", "architectural", "atmosphere"] as const;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {step !== "upload" && step !== "processing" ? (
            <button
              onClick={() => setStep(step === "result" ? "upload" : step === "style" ? "room" : "upload")}
              className="w-9 h-9 flex items-center justify-center bg-neutral-100 rounded-full active:scale-95 transition-all text-neutral-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link href="/app/dashboard" className="w-9 h-9 flex items-center justify-center bg-neutral-100 rounded-full active:scale-95 transition-all text-neutral-600">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
          <h1 className="font-bold text-base tracking-tight">
            {step === "upload" && "Start Photo"}
            {step === "room" && "Select Room"}
            {step === "style" && "Pick Style"}
            {step === "processing" && "Generating..."}
            {step === "result" && "Transformation"}
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-3 pt-4">
        <AnimatePresence mode="wait">

          {/* LOADING */}
          {authStatus === "loading" && (
            <div key="loading" className="flex justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
          )}

          {/* NOT LOGGED IN */}
          {authStatus === "not_logged_in" && (
            <div key="auth" className="text-center py-20">
              <Lock className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
              <p className="text-neutral-500 mb-8 px-4">Create an account or log in to use the application.</p>
              <Link href="/app" className="bg-black text-white px-8 py-4 rounded-full font-bold">Go to Login</Link>
            </div>
          )}

          {/* NO CREDITS */}
          {authStatus === "no_credits" && (
            <div key="credits" className="text-center py-20">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12 shadow-sm">
                <Sparkles className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Out of Credits</h2>
              <p className="text-neutral-500 mb-8 px-6 text-sm">Purchase a new pack to continue generating AI designs.</p>
              <button
                onClick={async () => {
                  const res = await fetch("/api/ai/checkout", { method: "POST" });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all"
              >
                Recharge ($20 for 40 Credits)
              </button>
            </div>
          )}

          {/* STEP 1: UPLOAD */}
          {authStatus === "authorized" && step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 text-center mb-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold mb-1">Capture your space</h2>
                <p className="text-sm text-neutral-500">Take a wide, well-lit photo of the room you want to transform.</p>
              </div>
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />
              <button onClick={() => cameraInputRef.current?.click()} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform">
                <Camera className="w-5 h-5" /> Take New Photo
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white border-2 border-neutral-200 text-neutral-800 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 active:scale-95 transition-transform">
                <ImageIcon className="w-5 h-5" /> Upload from Gallery
              </button>
            </motion.div>
          )}

          {/* STEP 2: SELECT ROOM */}
          {authStatus === "authorized" && step === "room" && (
            <motion.div key="room" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="bg-white p-2 rounded-3xl shadow-sm border border-neutral-100 mb-4 flex items-center gap-3">
                <img src={selectedImage!} alt="Preview" className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">Original Photo</p>
                  <button onClick={() => setStep('upload')} className="text-blue-600 text-xs font-medium">Change Image</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pb-safe">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => { setSelectedRoomId(room.id); setStep("style"); }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[1.02] bg-white shadow-sm ${selectedRoomId === room.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-neutral-100'}`}
                  >
                    <span className="text-2xl">{room.icon}</span>
                    <span className="font-semibold text-sm text-neutral-800">{room.nameKey}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT STYLE */}
          {authStatus === "authorized" && step === "style" && (
            <motion.div key="style" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="pb-28">
                {tierOrder.map((tier) => {
                  const tierStyles = STYLES.filter(s => s.tier === tier);
                  return (
                    <div key={tier} className="mb-5">
                      {/* Tier Label */}
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 px-1">
                        {TIER_LABELS[tier]}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {tierStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyleId(style.id)}
                            className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all active:scale-[1.02] ${selectedStyleId === style.id ? 'border-blue-600 shadow-lg' : 'border-transparent shadow-sm'}`}
                          >
                            <img src={style.image} alt={style.nameKey} className="absolute inset-0 w-full h-full object-cover" />
                            {/* Gradient overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-1.5 text-left">
                              <span className="text-white font-bold text-[9px] leading-tight block">{style.nameKey}</span>
                              <span className="text-white/70 text-[8px] leading-tight block">{style.descKey}</span>
                            </div>
                            {/* Recommended badge */}
                            {style.recommended && (
                              <div className="absolute top-1 left-1 bg-amber-400 text-amber-900 text-[7px] font-bold px-1 py-0.5 rounded-full flex items-center gap-0.5">
                                <Star className="w-2 h-2" />
                                Best
                              </div>
                            )}
                            {/* Selected check */}
                            {selectedStyleId === style.id && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fixed Generate Footer */}
              <div className="fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 p-3 pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                {error && <div className="text-red-500 text-xs text-center mb-2 font-medium bg-red-50 py-1.5 rounded-xl px-2">{error}</div>}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedStyleId}
                  className="w-full max-w-md mx-auto bg-black text-white py-3.5 rounded-2xl font-bold text-base disabled:opacity-30 flex items-center justify-center gap-2 active:scale-95 shadow-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" /> Generate (1 Credit)
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PROCESSING */}
          {authStatus === "authorized" && step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 rounded-[1.5rem] border-4 border-neutral-100" />
                <div className="absolute inset-0 rounded-[1.5rem] border-4 border-black border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-black animate-pulse" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">Transforming Space...</h2>
              <p className="text-neutral-500 text-sm max-w-xs px-4">AI is applying the style transformation. This usually takes 15–30 seconds.</p>
            </motion.div>
          )}

          {/* STEP 5: RESULT */}
          {authStatus === "authorized" && step === "result" && resultImage && (
            <motion.div key="result" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
              <CompareSlider originalImage={selectedImage!} resultImage={resultImage} />
              <div className="grid grid-cols-2 gap-3 mb-6 mt-4">
                <button onClick={handleDownload} className="bg-black text-white py-3.5 rounded-2xl font-bold shadow-md active:scale-95 transition-transform">Download</button>
                <button onClick={shareDesign} className="bg-white border-2 border-neutral-200 text-black py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Share className="w-4 h-4" /> Share
                </button>
              </div>
              <button onClick={() => setStep('upload')} className="w-full bg-blue-50 text-blue-600 py-3.5 rounded-2xl font-bold shadow-sm active:scale-95 transition-transform mb-8">
                Design Another Room
              </button>
              <ShopSimilarFurniture roomType={selectedRoomId || 'living_room'} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
