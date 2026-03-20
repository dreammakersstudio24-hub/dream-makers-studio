"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Loader2, Search, ExternalLink, Maximize2, Minimize2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@/utils/supabase/client";
import { AdUnit } from "@/components/AdUnit";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  after_image_url: string;
  style_category: string;
  keywords: string[];
  affiliate_url?: string;
  is_ai_generated: boolean;
}

export default function Gallery() {
  // Gallery States
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_approved', true) // Only show approved items
        .order('created_at', { ascending: false });
      
      if (data) setItems(data as GalleryItem[]);
      if (error) console.error("Error fetching gallery:", error);
      
      setLoading(false);
    };
    
    fetchGallery();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    
    return items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.style_category.toLowerCase().includes(query) ||
      (item.keywords && item.keywords.some(kw => kw.toLowerCase().includes(query)))
    );
  }, [items, searchQuery]);

  const relatedImages = useMemo(() => {
    if (!selectedImage) return [];
    return items.filter(item => {
      if (item.id === selectedImage.id) return false;
      if (!item.keywords || !selectedImage.keywords) return false;
      return item.keywords.some(kw => selectedImage.keywords.includes(kw));
    }).slice(0, 8);
  }, [selectedImage, items]);

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-white/10 relative">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 pt-32 pb-24 sm:pt-40">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-16 relative group">
           <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
           </div>
           <input 
             type="text"
             placeholder="Search by keyword, style, or room (e.g. Modern, Living Room)"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/5 border border-white/10 backdrop-blur-3xl rounded-full py-4 sm:py-5 pl-14 pr-8 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all font-medium text-sm sm:text-base tracking-tight"
           />
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
               <div key={n} className="break-inside-avoid aspect-[3/4] bg-white/5 rounded-3xl border border-white/5 animate-pulse flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-white/10 animate-spin" />
               </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 text-white/30 font-medium flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20 border border-white/10">
                 <Search className="w-8 h-8" />
             </div>
             <p className="text-2xl font-black tracking-tighter mb-2 text-white">No matches found.</p>
             <p className="text-sm mt-2 max-w-sm mx-auto text-white/40">Try a broader keyword or browse different styles.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {filteredItems.map((item, i) => {
              const showAd = i > 0 && i % 7 === 0;
              return (
                <div key={item.id} className="break-inside-avoid w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: (Math.min(i, 10)) * 0.05 }}
                    onClick={() => { setSelectedImage(item); setIsFullscreen(false); }}
                    className="group cursor-zoom-in relative bg-white/5 rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-all block w-full"
                    style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '4/5' : '1/1' }}
                  >
                    {item.after_image_url ? (
                      <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-white/40 font-black text-[10px] tracking-[0.3em] uppercase">{item.style_category}</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-sm font-black text-white mb-2 translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300 line-clamp-2 uppercase tracking-tighter">{item.title}</h3>
                      {item.is_ai_generated && (
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-400 uppercase font-black tracking-[0.2em] mt-1 translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Concept</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {showAd && (
                    <motion.div 
                      className="mt-4 w-full bg-white/5 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-3xl"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                    >
                      <AdUnit className="aspect-square sm:aspect-auto sm:h-64 flex items-center justify-center text-[10px] font-black tracking-[0.4em] text-white/20 uppercase" />
                    </motion.div>
                  )}
                </div>
              );
            })}
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
            className={`fixed inset-0 z-[110] overflow-y-auto backdrop-blur-2xl transition-colors ${isFullscreen ? 'bg-black' : 'bg-black/80 p-0 sm:p-4 md:p-8'}`}
            onClick={(e) => {
               if (e.target === e.currentTarget) {
                 if (isFullscreen) setIsFullscreen(false);
                 else setSelectedImage(null);
               }
            }}
          >
            <div className={`min-h-full flex items-center justify-center ${isFullscreen ? 'h-screen' : ''}`}>
              <div className="fixed top-8 left-8 right-8 flex justify-between items-center z-[120] pointer-events-none">
                <button 
                  className={`p-4 rounded-full transition-all pointer-events-auto shadow-2xl backdrop-blur-3xl border border-white/10 ${isFullscreen ? 'bg-black/50 hover:bg-black text-white border-white/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  onClick={() => isFullscreen ? setIsFullscreen(false) : setSelectedImage(null)}
                >
                   {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
              </div>
              
              <motion.div 
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                className={`${isFullscreen ? 'w-full h-full flex items-center justify-center p-4' : 'w-full max-w-6xl flex flex-col gap-8 my-16 sm:my-0'}`}
                onClick={(e) => e.stopPropagation()}
              >
                {isFullscreen ? (
                  <div className="relative w-full h-full flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
                     <img 
                       src={selectedImage.after_image_url} 
                       alt={selectedImage.title} 
                       className="max-w-full max-h-full object-contain cursor-zoom-out rounded-2xl shadow-[0_0_100px_rgba(0,0,0,1)]" 
                     />
                  </div>
                ) : (
                  <div className="bg-[#0a0a0b] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col lg:flex-row min-h-[70vh]">
                     <div className="w-full lg:w-[60%] bg-[#020203] relative min-h-[40vh] sm:min-h-[50vh] lg:min-h-full group cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
                        {selectedImage.after_image_url ? (
                           <img src={selectedImage.after_image_url} alt={selectedImage.title} className="absolute inset-0 w-full h-full object-cover sm:object-contain transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-white/5 font-black uppercase tracking-[0.5em]">No Vision</div>
                        )}
                        <div className="absolute top-6 right-6 bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md border border-white/10">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                     </div>

                     <div className="w-full lg:w-[40%] p-8 sm:p-12 flex flex-col bg-[#0a0a0b]">
                        <div className="flex items-center justify-between mb-8">
                           <span className="text-white/60 uppercase tracking-[0.3em] text-[10px] font-black bg-white/5 px-4 py-2 rounded-full border border-white/10">
                             {selectedImage.style_category}
                           </span>
                           {selectedImage.is_ai_generated && (
                             <span className="text-blue-400 text-[10px] tracking-[0.2em] font-black uppercase flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                AI Concept
                             </span>
                           )}
                        </div>
                        
                        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">{selectedImage.title}</h2>
                        {selectedImage.description && <p className="text-white/40 font-medium text-sm sm:text-base leading-relaxed mb-8 tracking-tight">{selectedImage.description}</p>}

                        {selectedImage.keywords && selectedImage.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-10">
                            {selectedImage.keywords.map(kw => (
                              <button key={kw} onClick={() => { setSearchQuery(kw); setSelectedImage(null); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black tracking-widest text-white/60 rounded-full border border-white/10 uppercase">{kw}</button>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto pt-10 border-t border-white/5">
                          <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black mb-6">Acquire Experience</h4>
                          <Link href={`/shop/${selectedImage.style_category.toLowerCase().replace(/ /g, '-')}`} className="w-full bg-white text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-3 group mb-4">
                            Explore {selectedImage.style_category} Pieces
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                          </Link>
                          {!selectedImage.affiliate_url && (
                             <div className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 text-center">
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] leading-loose"> studio alternatives curated for this vision. </p>
                             </div>
                          )}
                        </div>
                     </div>
                  </div>
                )}

                {relatedImages.length > 0 && !isFullscreen && (
                  <div className="pb-16">
                     <h3 className="text-xl font-black tracking-tight mb-8 text-white">More like this</h3>
                     <div className="columns-2 sm:columns-3 xl:columns-4 gap-4 space-y-4">
                        {relatedImages.map(item => (
                           <div key={item.id} className="break-inside-avoid w-full relative rounded-2xl overflow-hidden cursor-pointer group border border-white/10 aspect-[4/5] bg-white/5" onClick={() => setSelectedImage(item)}>
                             <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                           </div>
                        ))}
                     </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
