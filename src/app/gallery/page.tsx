"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock data (would fetch from Supabase later)
const GALLERY_ITEMS = [
  { id: 1, title: "Modern Minimalist Living", category: "Living Room", image: "/placeholder-1.jpg" },
  { id: 2, title: "Cozy Bedroom Retreat", category: "Bedroom", image: "/placeholder-2.jpg" },
  { id: 3, title: "Luxury Kitchen", category: "Kitchen", image: "/placeholder-3.jpg" },
  { id: 4, title: "Zen Bathroom", category: "Bathroom", image: "/placeholder-4.jpg" },
  { id: 5, title: "Open Concept Dining", category: "Dining", image: "/placeholder-5.jpg" },
  { id: 6, title: "Home Office Sanctuary", category: "Office", image: "/placeholder-6.jpg" },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-40">
        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm tracking-widest uppercase">Back to Home</span>
        </Link>
        <div className="text-xl font-light tracking-widest uppercase">Gallery</div>
        <div className="w-24" /> {/* Spacer for centering */}
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto p-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden relative border border-white/5 hover:border-white/20 transition-colors"
            >
              {/* Fallback pattern since we don't have real images yet */}
              <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-neutral-600 font-light text-sm tracking-widest uppercase">{item.category}</span>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-medium mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modal / Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-4 rounded-full bg-white/5 hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl aspect-video bg-neutral-900 rounded-3xl flex items-center justify-center overflow-hidden relative border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="text-center p-12">
                  <span className="block text-4xl font-light mb-4 text-white/90">{selectedImage.title}</span>
                  <span className="text-neutral-500 uppercase tracking-widest text-sm bg-white/5 px-4 py-2 rounded-full">{selectedImage.category}</span>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
