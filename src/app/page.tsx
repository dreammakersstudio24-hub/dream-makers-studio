"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Loader2, Search, ExternalLink, Menu } from "lucide-react";
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

export default function Home() {
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Gallery States
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      {/* Navigation */}
      <nav className="fixed w-full z-40 top-0 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-widest uppercase">
            Dream<span className="font-semibold text-neutral-400">Makers</span>
          </Link>
          
          <div className="hidden md:flex gap-8 text-sm tracking-widest text-neutral-400">
             <Link href="/" className="text-white transition-colors">Gallery</Link>
             <Link href="/directory" className="hover:text-white transition-colors">Contractors</Link>
             <Link href="/real-estate" className="hover:text-white transition-colors">Real Estate</Link>
             <Link href="/ebook" className="hover:text-white transition-colors">E-Book</Link>
          </div>

          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-black border-b border-white/10 flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-6 right-6 p-2 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-xl tracking-widest text-center">
               <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white transition-colors">GALLERY</Link>
               <Link href="/directory" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-400 transition-colors">CONTRACTORS</Link>
               <Link href="/real-estate" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-400 transition-colors">REAL ESTATE</Link>
               <Link href="/ebook" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-400 transition-colors">E-BOOK</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto p-6 pt-32">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative group">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
           </div>
           <input 
             type="text"
             placeholder="Search by keyword, style, or room (e.g. Modern, Living Room)"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-neutral-900/50 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-all font-light"
           />
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
               <div key={n} className="break-inside-avoid aspect-[3/4] bg-neutral-900 rounded-3xl border border-white/5 animate-pulse flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
               </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 text-neutral-500 font-light flex flex-col items-center justify-center">
             <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6">
                 <Search className="w-6 h-6" />
             </div>
             <p className="text-xl">No inspiration found for "{searchQuery}".</p>
             <p className="text-sm mt-2 max-w-sm mx-auto">Try a different keyword or browse our main categories.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredItems.map((item, i) => {
              // Interject AdUnits every 7th item
              const showAd = i > 0 && i % 7 === 0;

              return (
                <div key={item.id} className="break-inside-avoid w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: (i % 10) * 0.05 }}
                    onClick={() => setSelectedImage(item)}
                    className="group cursor-zoom-in relative bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all block w-full"
                    style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '4/5' : '1/1' }}
                  >
                    {item.after_image_url ? (
                      <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-neutral-600 font-light text-sm tracking-widest uppercase">{item.style_category}</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-lg font-medium mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                      {item.is_ai_generated && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-300 uppercase tracking-widest mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          <span>✨ AI Generated Concept</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Inject Ad Unit block right after this item if needed */}
                  {showAd && (
                    <motion.div 
                      className="mt-6 w-full"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                    >
                      <AdUnit className="aspect-square sm:aspect-auto sm:h-64" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail Modal / Lightbox with Related Images */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-black/95 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <div className="min-h-full flex items-center justify-center pointer-events-none">
              <button 
                className="fixed top-6 left-6 p-4 rounded-full bg-white/5 hover:bg-white/20 transition-colors pointer-events-auto z-[80] text-white border border-white/10"
                onClick={() => setSelectedImage(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-6xl pointer-events-auto flex flex-col gap-8 my-16"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Main Content Area: Image + Details Side-by-Side */}
                <div className="bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 flex flex-col lg:flex-row">
                   
                   {/* Left side: Image */}
                   <div className="w-full lg:w-[60%] bg-black relative aspect-square lg:aspect-auto">
                      {selectedImage.after_image_url ? (
                         <img src={selectedImage.after_image_url} alt={selectedImage.title} className="absolute inset-0 w-full h-full object-contain" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                      )}
                   </div>

                   {/* Right side: Info */}
                   <div className="w-full lg:w-[40%] p-8 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                         <span className="text-neutral-500 uppercase tracking-widest text-xs font-medium bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
                           {selectedImage.style_category}
                         </span>
                         {selectedImage.is_ai_generated && (
                           <span className="text-blue-400 text-xs tracking-widest uppercase flex items-center gap-1">✨ AI Concept</span>
                         )}
                      </div>
                      
                      <h2 className="text-3xl font-light mb-4">{selectedImage.title}</h2>
                      
                      {selectedImage.description && (
                         <p className="text-neutral-400 font-light leading-relaxed mb-6">{selectedImage.description}</p>
                      )}

                      {/* Keywords */}
                      {selectedImage.keywords && selectedImage.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                          {selectedImage.keywords.map(kw => (
                            <button key={kw} onClick={() => { setSearchQuery(kw); setSelectedImage(null); }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-colors text-xs tracking-widest text-neutral-300 rounded-full border border-white/5">
                               {kw}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Monetization: Affiliate Link Button */}
                      {selectedImage.affiliate_url ? (
                        <a 
                          href={selectedImage.affiliate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-white text-black py-4 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group mt-8"
                        >
                          Shop This Look
                          <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      ) : (
                        <div className="mt-8 border-t border-white/10 pt-6">
                           <AdUnit className="w-full min-h-[120px]" />
                        </div>
                      )}
                   </div>
                </div>

                {/* Related Images Section */}
                {relatedImages.length > 0 && (
                  <div className="mt-12">
                     <h3 className="text-xl font-light tracking-wide mb-6 px-2">More like this</h3>
                     <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
                        {relatedImages.map(item => (
                           <div 
                             key={item.id} 
                             className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer group border border-white/5 aspect-[4/5]"
                             onClick={() => setSelectedImage(item)}
                           >
                             <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs uppercase tracking-widest">View</span>
                             </div>
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
