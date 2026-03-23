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
      
      if (!res.ok) {
        throw new Error("Failed to authenticate download or session expired");
      }
      
      // Get the binary PDF data from the response stream
      const blob = await res.blob();
      
      // Create a temporary link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "50 Cinematic AI Prompts for Stunning Backyard & Garden Designs.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white border border-neutral-100 shadow-lg rounded-3xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-50 border border-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-3 text-neutral-900">Payment Successful!</h1>
        <p className="text-neutral-500 mb-8 leading-relaxed text-sm">
          Thank you for your purchase. Your E-Book is ready to download. A receipt has been sent to your email.
        </p>

        <div className="space-y-3">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{errorMsg}</div>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-black text-white py-4 rounded-2xl text-sm font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {downloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Preparing download...</>
            ) : (
              <><Download className="w-4 h-4" /> Download PDF</>
            )}
          </button>
          <Link href="/" className="w-full text-neutral-500 py-3 rounded-2xl text-sm font-medium hover:text-neutral-900 transition-colors flex items-center justify-center gap-2 group">
            Return Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center text-sm text-neutral-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
