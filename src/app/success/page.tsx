"use client";

import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDownload = async () => {
    if (!sessionId) {
      setErrorMsg("Session ID missing. Please contact support.");
      return;
    }

    setDownloading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/download?session_id=${sessionId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to get download link");
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-neutral-900 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-light mb-4 text-white/90">Payment Successful!</h1>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Thank you for your purchase. Your E-Book is ready to download. A receipt has been sent to your email.
          </p>
          
          <div className="space-y-4">
            {errorMsg && (
               <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-sm border border-red-500/20">{errorMsg}</div>
            )}
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-white text-black py-4 rounded-full text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {downloading ? (
                 <><Loader2 className="w-4 h-4 animate-spin" /> Generating Secure Link...</>
              ) : (
                 <><Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" /> Download PDF File</>
              )}
            </button>
            <Link href="/" className="w-full text-neutral-400 py-4 rounded-full text-sm tracking-widest font-medium hover:text-white transition-colors flex items-center justify-center gap-2 group">
              Return Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center text-sm tracking-widest text-neutral-500 uppercase">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
