"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, X, Loader2, Sparkles, ChevronLeft, Check, Lock } from "lucide-react";
import Link from "next/link";
import { STYLES } from "@/constants/styles";
import { ROOM_TYPES } from "@/constants/roomTypes";

// Utility to compress image to base64 to ensure it fits within Vercel's 4.5MB payload limit
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

import { logout } from '@/actions/auth'

export default function AiRedesignPage() {
  const [step, setStep] = useState<"upload" | "room" | "style" | "processing" | "result">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Auth and Paywall states
  const [authStatus, setAuthStatus] = useState<"loading" | "authorized" | "not_logged_in" | "no_credits">("loading");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    // Check if user is logged in and has credits
    fetch('/api/user/ai-access')
      .then(res => res.json())
      .then(data => {
        if (!data.authorized && data.reason === "NOT_LOGGED_IN") {
           setAuthStatus("not_logged_in");
        } else if (!data.authorized && data.reason === "NO_CREDITS") {
           setAuthStatus("no_credits");
           setCredits(0);
        } else {
           setAuthStatus("authorized");
           setCredits(data.credits || 0);
        }
      })
      .catch((err) => {
         console.error(err);
         setAuthStatus("not_logged_in");
      });
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
      const stylePrompt = styleInfo?.nameKey || "modern";
      
      const roomInfo = ROOM_TYPES.find(r => r.id === selectedRoomId);
      const roomType = roomInfo?.nameKey || "room";

      // 2. Call the backend API
      const response = await fetch("/api/redesign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: compressed.url,
          stylePrompt: stylePrompt,
          roomType: roomType,
          aspectRatio: compressed.ratio
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image.");
      }

      // 3. Display the result
      setResultImage(data.resultUrl);
      setStep("result");

    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An unexpected error occurred.");
      setStep("style"); // Go back to style selection to see the error
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setSelectedRoomId(null);
    setSelectedStyleId(null);
    setResultImage(null);
    setError(null);
    setStep("upload");
  };

  const downloadImage = async () => {
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
    } catch (error) {
       console.error("Failed to download image", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 font-sans">
      {/* Dynamic Header */}
      <nav className="fixed w-full z-40 top-0 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => step === "upload" ? window.history.back() : setStep(step === "result" ? "upload" : step === "processing" ? "processing" : step === "style" ? "room" : "upload")}
            className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors"
            disabled={step === "processing"}
          >
             <ChevronLeft className="w-6 h-6" />
          </button>
          
          <span className="text-lg font-medium tracking-wide">
            {step === "upload" && "Upload Photo"}
            {step === "room" && "Room Type"}
            {step === "style" && "Choose Style"}
            {step === "processing" && "Redesigning..."}
            {step === "result" && "Your New Room"}
          </span>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/history"
              className="text-sm font-medium hover:text-white text-neutral-400 transition-colors"
            >
              History
            </Link>
            
            {authStatus === "authorized" && (
              <form action={logout}>
                <button 
                  type="submit"
                  className="text-sm font-medium hover:text-white text-neutral-400 transition-colors"
                >
                  Log Out
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Credits Indicator */}
        {authStatus === "authorized" && (
          <div className="absolute top-16 left-0 w-full bg-neutral-900 border-b border-white/10 px-4 py-2 flex justify-center items-center gap-2 text-xs font-medium text-neutral-300">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span>{credits} AI Credits Available</span>
          </div>
        )}
      </nav>

      {/* Main Content Area - Mobile optimized width */}
      <main className="max-w-3xl mx-auto pt-24 pb-32 px-4 sm:px-6 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* AUTHENTICATION & PAYWALL BLOCKERS */}
          {authStatus === "loading" && (
            <motion.div 
               key="loading" 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="flex-1 flex flex-col items-center justify-center py-32"
            >
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </motion.div>
          )}

          {authStatus === "not_logged_in" && (
            <motion.div 
               key="not_logged_in" 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
               className="flex-1 flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Lock className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-3xl font-light mb-4 text-white">Member Access Only</h2>
              <p className="text-neutral-400 mb-10 max-w-sm">Please log in or create an account to use the AI Interior Designer tool.</p>
              <Link href="/login" className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors">
                Sign In / Join
              </Link>
            </motion.div>
          )}

          {authStatus === "no_credits" && (
            <motion.div 
               key="no_credits" 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
               className="flex-1 flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Sparkles className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-3xl font-light mb-4 text-white">Recharge Your Credits</h2>
              <p className="text-neutral-400 mb-10 max-w-md">You've reached your generation limit. Purchase an AI Developer Pass to instantly unlock 50 more high-quality 8K room transformations.</p>
              
              <button 
                onClick={async () => {
                   try {
                     const res = await fetch("/api/ai/checkout", { method: "POST" });
                     const data = await res.json();
                     if (data.url) window.location.href = data.url;
                   } catch (e) {
                     console.error(e);
                   }
                }}
                className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <span>Buy 50 Credits for $9.99</span>
              </button>
            </motion.div>
          )}

          {/* STEP 1: UPLOAD */}
          {authStatus === "authorized" && step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col items-center justify-center py-12"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                <Sparkles className="w-10 h-10 text-neutral-400" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-light mb-4 text-center">Transform your space</h1>
              <p className="text-neutral-400 text-center mb-12 max-w-sm font-light">
                Take a photo of your room or upload one from your gallery to get started.
              </p>

              <div className="w-full max-w-md space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                />
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-white text-black py-4 px-6 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  Take a Photo
                </button>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-neutral-900 border border-white/10 text-white py-4 px-6 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 hover:bg-neutral-800 transition-colors"
                >
                  <ImageIcon className="w-6 h-6" />
                  Upload from Gallery
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1.5: SELECT ROOM */}
          {authStatus === "authorized" && step === "room" && (
            <motion.div
              key="room"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-6 relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl mx-auto">
                 <img src={selectedImage!} alt="Original" className="w-full h-full object-cover" />
                 <button 
                    onClick={() => setStep("upload")}
                    className="absolute top-1 right-1 p-1 bg-black/50 backdrop-blur-md rounded-full text-white"
                 >
                    <X className="w-3 h-3" />
                 </button>
              </div>
              <h2 className="text-2xl font-light mb-6 text-center">What type of room is this?</h2>
              
              <div className="grid grid-cols-2 gap-4 pb-24">
                {ROOM_TYPES.map((room) => (
                  <div 
                    key={room.id}
                    onClick={() => {
                        setSelectedRoomId(room.id)
                        setStep("style")
                    }}
                    className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 ${selectedRoomId === room.id ? 'border-white bg-white/10' : 'border-transparent'}`}
                  >
                    <span className="text-4xl">{room.icon}</span>
                    <span className="text-white font-medium text-center">{room.nameKey}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT STYLE */}
          {authStatus === "authorized" && step === "style" && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-6 relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl mx-auto">
                 <img src={selectedImage!} alt="Original" className="w-full h-full object-cover" />
                 <button 
                    onClick={() => setStep("upload")}
                    className="absolute top-1 right-1 p-1 bg-black/50 backdrop-blur-md rounded-full text-white"
                 >
                    <X className="w-3 h-3" />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-24">
                {STYLES.map((style) => (
                  <div 
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`relative rounded-3xl overflow-hidden aspect-[3/4] border-2 transition-all cursor-pointer ${selectedStyleId === style.id ? 'border-white' : 'border-transparent'}`}
                  >
                    <img src={style.image} alt={style.nameKey} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                       <span className="text-white font-medium">{style.nameKey}</span>
                       <span className="text-neutral-400 text-xs mt-1 line-clamp-1">{style.descKey}</span>
                    </div>

                    {selectedStyleId === style.id && (
                       <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                          <Check className="w-4 h-4" />
                       </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Fixed Footer for Generate Button */}
              <div className="fixed bottom-0 left-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
                 <div className="max-w-3xl mx-auto space-y-3">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
                        {error}
                      </div>
                    )}
                    <button 
                      onClick={handleGenerate}
                      disabled={!selectedStyleId}
                      className="w-full bg-white text-black py-4 rounded-2xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Generate Design
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PROCESSING */}
          {authStatus === "authorized" && step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-24"
            >
              <div className="relative w-32 h-32 mb-8">
                 <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                 <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                 </div>
              </div>
              <h2 className="text-2xl font-light mb-2">Designing your dream space...</h2>
              <p className="text-neutral-400 font-light text-center max-w-xs">
                Our AI is currently analyzing your room structure and applying the selected style.
              </p>
            </motion.div>
          )}

          {/* STEP 4: RESULT */}
          {authStatus === "authorized" && step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-neutral-900 rounded-3xl overflow-hidden mb-8 border border-white/5 shadow-2xl">
                 <img src={resultImage!} alt="Redesign Result" className="w-full h-full max-h-[70vh] object-contain" />
                 
                 <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-widest border border-white/10 text-white">
                       {STYLES.find(s => s.id === selectedStyleId)?.nameKey}
                    </span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={downloadImage}
                   className="w-full bg-neutral-900 border border-white/10 text-white py-4 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
                 >
                   Download
                 </button>
                 <button 
                   onClick={resetAll}
                   className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                 >
                   Design Another
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
