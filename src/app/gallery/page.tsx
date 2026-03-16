"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Loader2, Search, ExternalLink, Maximize2, Minimize2, ArrowRight } from "lucide-react";
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
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-900 selection:bg-blue-100 selection:text-blue-900 relative">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 pt-24 pb-24 sm:pt-32">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 relative group">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-blue-600 transition-colors" />
           </div>
           <input 
             type="text"
             placeholder="Search by keyword, style, or room (e.g. Modern, Living Room)"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white border border-neutral-200 shadow-sm rounded-full py-3 sm:py-4 pl-12 pr-6 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-light text-sm sm:text-base"
           />
        </div>

        {/* Pinterest-style Masonry Grid - 2 columns on mobile */}
        {loading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
               <div key={n} className="break-inside-avoid aspect-[3/4] bg-white rounded-2xl sm:rounded-3xl border border-neutral-100 animate-pulse flex items-center justify-center shadow-sm">
                 <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
               </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 text-neutral-500 font-light flex flex-col items-center justify-center bg-white border border-neutral-200 rounded-3xl shadow-sm">
             <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                 <Search className="w-6 h-6" />
             </div>
             <p className="text-xl font-medium tracking-wide mb-2 text-neutral-900">No inspiration found for "{searchQuery}".</p>
             <p className="text-sm mt-2 max-w-sm mx-auto text-neutral-500">Try a different keyword or browse our main categories.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
            {filteredItems.map((item, i) => {
              // Interject AdUnits every 7th item
              const showAd = i > 0 && i % 7 === 0;

              return (
                <div key={item.id} className="break-inside-avoid w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: (Math.min(i, 10)) * 0.05 }}
                    onClick={() => { setSelectedImage(item); setIsFullscreen(false); }}
                    className="group cursor-zoom-in relative bg-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-neutral-200 transition-all block w-full"
                    style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '4/5' : '1/1' }}
                  >
                    {item.after_image_url ? (
                      <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-neutral-500 font-medium text-xs tracking-widest uppercase">{item.style_category}</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay - Lightened for light theme */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-sm font-medium text-white mb-1 translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300 line-clamp-2">{item.title}</h3>
                      {item.is_ai_generated && (
                        <div className="flex items-center gap-1 text-[9px] text-blue-300 uppercase tracking-widest mt-1 translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          <span>✨ AI Generated</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {showAd && (
                    <motion.div 
                      className="mt-3 sm:mt-4 w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                    >
                      <AdUnit className="aspect-square sm:aspect-auto sm:h-64 flex items-center justify-center text-xs text-neutral-400 bg-neutral-50" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail Modal / Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[70] overflow-y-auto backdrop-blur-md transition-colors ${isFullscreen ? 'bg-black' : 'bg-neutral-900/60 p-0 sm:p-4 md:p-8'}`}
            onClick={(e) => {
               // Only close if clicking the backdrop
               if (e.target === e.currentTarget) {
                 if (isFullscreen) setIsFullscreen(false);
                 else setSelectedImage(null);
               }
            }}
          >
            <div className={`min-h-full flex items-center justify-center ${isFullscreen ? 'h-screen' : ''}`}>
              
              {/* Controls container - absolute positioning */}
              <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-[80] pointer-events-none">
                <button 
                  className={`p-3 sm:p-4 rounded-full transition-colors pointer-events-auto shadow-sm backdrop-blur-md ${isFullscreen ? 'bg-black/50 hover:bg-black/80 text-white border-white/20' : 'bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200'}`}
                  onClick={() => isFullscreen ? setIsFullscreen(false) : setSelectedImage(null)}
                >
                   {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
              </div>
              
              <motion.div 
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`${isFullscreen ? 'w-full h-full flex items-center justify-center p-4' : 'w-full max-w-6xl flex flex-col gap-6 sm:gap-8 my-16 sm:my-0'}`}
                onClick={(e) => e.stopPropagation()}
              >
                {isFullscreen ? (
                  // TRUE FULL SCREEN IMAGE VIEW
                  <div className="relative w-full h-full flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
                     <img 
                       src={selectedImage.after_image_url} 
                       alt={selectedImage.title} 
                       className="max-w-full max-h-full object-contain cursor-zoom-out rounded-lg shadow-2xl" 
                     />
                  </div>
                ) : (
                  // DETAIL VIEW (Image + Ads + Info side by side)
                  <>
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-xl border border-neutral-200 flex flex-col lg:flex-row min-h-[70vh]">
                       
                       {/* Left side: Image (Click to expand) */}
                       <div className="w-full lg:w-[60%] bg-neutral-100 relative min-h-[40vh] sm:min-h-[50vh] lg:min-h-full group cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
                          {selectedImage.after_image_url ? (
                             <img src={selectedImage.after_image_url} alt={selectedImage.title} className="absolute inset-0 w-full h-full object-cover sm:object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                          )}
                          <div className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                          {/* Mobile expand hint */}
                          <div className="absolute bottom-4 right-4 bg-white/90 text-neutral-900 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm lg:hidden flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" /> Tap to expand
                          </div>
                       </div>

                       {/* Right side: Info and Ads */}
                       <div className="w-full lg:w-[40%] p-6 sm:p-8 flex flex-col bg-white">
                          <div className="flex items-center justify-between mb-4 sm:mb-6">
                             <span className="text-light-blue-600 uppercase tracking-widest text-[10px] sm:text-xs font-bold bg-light-blue-50 px-3 py-1.5 rounded-full border border-light-blue-100">
                               {selectedImage.style_category}
                             </span>
                             {selectedImage.is_ai_generated && (
                               <span className="text-orange-500 text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-1 font-semibold">✨ AI Concept</span>
                             )}
                          </div>
                          
                          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-3 sm:mb-4">{selectedImage.title}</h2>
                          
                          {selectedImage.description && (
                             <p className="text-neutral-600 font-light text-sm sm:text-base leading-relaxed mb-6">{selectedImage.description}</p>
                          )}

                          {/* Keywords as tags */}
                          {selectedImage.keywords && selectedImage.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                              {selectedImage.keywords.map(kw => (
                                <button key={kw} onClick={() => { setSearchQuery(kw); setSelectedImage(null); }} className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 transition-colors text-[10px] sm:text-xs tracking-widest text-neutral-600 rounded-full border border-neutral-200">
                                   {kw}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto pt-6 border-t border-neutral-100">
                            {/* Internal Shop Link prioritized */}
                            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-4">Get the look</h4>
                            
                            <Link 
                              href={`/shop/${selectedImage.style_category.toLowerCase().replace(/ /g, '-')}`}
                              className="w-full bg-neutral-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group mb-3 shadow-lg shadow-neutral-100"
                            >
                              Shop {selectedImage.style_category} Collection
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {selectedImage.affiliate_url && (
                              <div className="grid grid-cols-2 gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                <a 
                                  href={selectedImage.affiliate_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full border border-neutral-200 text-neutral-600 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                                >
                                  Amazon Finds
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <a 
                                  href={selectedImage.affiliate_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full border border-neutral-200 text-neutral-600 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                                >
                                  Temu Store
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}

                            {!selectedImage.affiliate_url && (
                               <div className="w-full p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-loose">
                                    Our studio curates high-end alternatives specifically for this {selectedImage.style_category.toLowerCase()} concept.
                                  </p>
                               </div>
                            )}
                          </div>
                       </div>
                    </div>

                    {/* Related Images Section (Only visible outside full screen) */}
                    {relatedImages.length > 0 && (
                      <div className="mt-6 sm:mt-8 px-4 sm:px-0 pb-8">
                         <h3 className="text-lg sm:text-xl font-medium tracking-wide mb-4 sm:mb-6 text-neutral-900 px-2 lg:px-0">More like this</h3>
                         <div className="columns-2 sm:columns-3 xl:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                            {relatedImages.map(item => (
                               <div 
                                 key={item.id} 
                                 className="break-inside-avoid w-full relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group border border-neutral-200 shadow-sm aspect-[4/5] bg-neutral-200 transition-shadow hover:shadow-md block"
                                 onClick={() => setSelectedImage(item)}
                               >
                                 <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                 <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="px-4 py-2 bg-white text-neutral-900 rounded-full text-xs uppercase tracking-widest font-semibold shadow-sm">View</span>
                                 </div>
                               </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
