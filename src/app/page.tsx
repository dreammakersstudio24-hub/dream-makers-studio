"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Map, Building2, BookOpen, Sparkles, Layout, Package, Info, ChevronRight, Wand2 } from "lucide-react";

export default function Home() {
  const portalLinks = [
    {
      title: "AI Room Designer",
      description: "Instantly reimagine your space with our advanced AI staging technology.",
      icon: <Sparkles className="w-8 h-8 text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />,
      href: "/app",
      color: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-500/20 group-hover:border-blue-400/50",
      accent: "bg-blue-500",
      delay: 0.1
    },
    {
      title: "Design Gallery",
      description: "Explore our curated collection of luxury interior inspirations.",
      icon: <Layout className="w-8 h-8 text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />,
      href: "/gallery",
      color: "from-emerald-500/10 to-emerald-600/5",
      borderColor: "border-emerald-500/20 group-hover:border-emerald-400/50",
      accent: "bg-emerald-500",
      delay: 0.2
    },
    {
      title: "Premium Directory",
      description: "Connect with elite contractors and artisans vetted by our studio.",
      icon: <Map className="w-8 h-8 text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />,
      href: "/directory",
      color: "from-orange-500/10 to-orange-600/5",
      borderColor: "border-orange-500/20 group-hover:border-orange-400/50",
      accent: "bg-orange-500",
      delay: 0.3
    },
    {
      title: "Masterclass E-Book",
      description: "Learn the secrets of luxury interior design with our masterclass.",
      icon: <BookOpen className="w-8 h-8 text-indigo-400 group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />,
      href: "/ebook",
      color: "from-indigo-500/10 to-indigo-600/5",
      borderColor: "border-indigo-500/20 group-hover:border-indigo-400/50",
      accent: "bg-indigo-500",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-white/10 relative overflow-x-hidden font-sans">
      
      {/* Immersive Hero Background */}
      <div className="absolute inset-0 z-0">
         <img 
            src="/landing-hero.png" 
            className="w-full h-full object-cover opacity-40 blur-[2px] scale-105" 
            alt="Luxury Architecture"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-[#020203]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center">
        
        {/* Dynamic Badge */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="mb-8"
        >
           <div className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] text-[11px] font-black uppercase tracking-[0.4em] text-white/60">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Elite Design Ecosystem
           </div>
        </motion.div>
        
        {/* Hero Typography */}
        <div className="text-center max-w-4xl mx-auto mb-20 sm:mb-24 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl sm:text-8xl font-black tracking-tight text-white leading-[0.9] flex flex-col"
          >
            Turning Concepts <br/> 
            <span className="text-white/30 italic font-medium -mt-2 tracking-tighter">Into Reality.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/50 font-medium leading-relaxed max-w-2xl mx-auto tracking-tight"
          >
            Your ultimate destination for curated luxury design inspiration, vetted professional contractors, and exclusive AI tools.
          </motion.p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
          {portalLinks.map((portal) => (
            <Link href={portal.href} key={portal.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: portal.delay }}
                whileHover={{ y: -8, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`group h-full p-10 rounded-[2.5rem] bg-gradient-to-br ${portal.color} border ${portal.borderColor} backdrop-blur-3xl shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col`}
              >
                {/* Glowing Circle Background */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/5 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                
                <div className="mb-8 p-4 w-fit rounded-2xl bg-white/5 border border-white/10 shadow-lg group-hover:border-white/20 transition-all">
                  {portal.icon}
                </div>
                
                <h2 className="text-3xl font-black mb-3 tracking-tighter text-white group-hover:text-white transition-colors">
                  {portal.title}
                </h2>
                
                <p className="text-white/40 font-medium leading-normal mb-8 flex-grow text-[15px]">
                  {portal.description}
                </p>

                <div className="mt-auto flex items-center justify-between text-xs font-black tracking-[0.2em] uppercase text-white/20 group-hover:text-white transition-all duration-500">
                  <span>Explore Experience</span>
                  <ArrowRight className="w-5 h-5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bottom Social / Info Badge */}
        <footer className="mt-32 opacity-20 hover:opacity-100 transition-opacity duration-700 flex flex-col items-center gap-4">
           <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent mb-4" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Dream Makers Studio © 2026</p>
        </footer>
      </main>
    </div>
  );
}
