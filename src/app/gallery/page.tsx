"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@/utils/supabase/client";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  after_image_url: string;
  style_category: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setItems(data as GalleryItem[]);
      if (error) console.error("Error fetching gallery:", error);
      
      setLoading(false);
    };
    
    fetchGallery();
  }, []);

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
               <div key={n} className="aspect-[4/5] bg-neutral-900 rounded-2xl border border-white/5 animate-pulse flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
               </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-neutral-500 font-light flex flex-col items-center justify-center">
             <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6">
                 <span className="text-2xl">📸</span>
             </div>
             <p className="text-xl">No gallery items yet.</p>
             <p className="text-sm mt-2 max-w-sm mx-auto">Add images in your Supabase 'gallery_items' table to feature them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedImage(item)}
                className="group cursor-pointer aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden relative border border-white/5 hover:border-white/20 transition-colors"
              >
                {item.after_image_url ? (
                  <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-neutral-600 font-light text-sm tracking-widest uppercase">{item.style_category}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-medium mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
               {selectedImage.after_image_url ? (
                  <img src={selectedImage.after_image_url} alt={selectedImage.title} className="absolute inset-0 w-full h-full object-contain bg-black" />
               ) : (
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center" />
               )}
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-12 text-center pointer-events-none">
                  <span className="block text-4xl font-light mb-4 text-white/90">{selectedImage.title}</span>
                  <span className="text-neutral-500 uppercase tracking-widest text-sm bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">{selectedImage.style_category}</span>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
