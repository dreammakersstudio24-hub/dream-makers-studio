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
            className="w-full h-full object-cover opacity-30 blur-[4px] scale-105" 
            alt="Luxury Architecture"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-[#020203]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:py-28 flex flex-col items-center">
        
        {/* Dynamic Badge */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="mb-10"
        >
           <div className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_0_20px_rgba(255,255,255,0.05)] text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Elite Design Ecosystem
           </div>
        </motion.div>
        
        {/* Hero Typography */}
        <div className="text-center max-w-4xl mx-auto mb-20 sm:mb-28 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl sm:text-6xl font-black tracking-tighter text-white leading-tight uppercase"
          >
            Turning Concepts <br/> 
            <span className="text-white/20 font-black tracking-tighter">Into Reality.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base sm:text-lg text-white/30 font-medium leading-relaxed max-w-xl mx-auto tracking-normal uppercase"
          >
            Curated luxury design inspiration and exclusive AI-powered architectural tools.
          </motion.p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
          {[
            {
              title: "AI Studio",
              description: "Instantly reimagine your space with our advanced AI staging technology.",
              icon: <Sparkles className="w-12 h-12 text-blue-400" />,
              href: "/app",
              color: "from-blue-500/10 to-blue-600/5",
              borderColor: "border-blue-500/20 group-hover:border-blue-400/50",
              delay: 0.1
            },
            {
              title: "Design Gallery",
              description: "Explore our curated collection of luxury interior inspirations.",
              icon: <Layout className="w-12 h-12 text-emerald-400" />,
              href: "/gallery",
              color: "from-emerald-500/10 to-emerald-600/5",
              borderColor: "border-emerald-500/20 group-hover:border-emerald-400/50",
              delay: 0.2
            },
            {
              title: "Gallery Shop",
              description: "Acquire exclusive pieces meticulously selected by the Studio.",
              icon: <Package className="w-12 h-12 text-orange-400" />,
              href: "/shop",
              color: "from-orange-500/10 to-orange-600/5",
              borderColor: "border-orange-500/20 group-hover:border-orange-400/50",
              delay: 0.3
            },
            {
              title: "Digital E-Book",
              description: "Learn the secrets of luxury interior design with our pro guide.",
              icon: <BookOpen className="w-12 h-12 text-indigo-400" />,
              href: "/ebook",
              color: "from-indigo-500/10 to-indigo-600/5",
              borderColor: "border-indigo-500/20 group-hover:border-indigo-400/50",
              delay: 0.4
            }
          ].map((portal) => (
            <Link href={portal.href} key={portal.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: portal.delay }}
                whileHover={{ y: -8, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`group h-full p-12 rounded-[3rem] bg-gradient-to-br ${portal.color} border ${portal.borderColor} backdrop-blur-3xl shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center`}
              >
                {/* Glowing Circle Background */}
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-700" />
                
                <div className="mb-10 p-6 rounded-[2rem] bg-white/5 border border-white/10 shadow-xl group-hover:scale-110 group-hover:border-white/20 transition-all duration-500">
                  {portal.icon}
                </div>
                
                <h2 className="text-3xl font-black mb-4 tracking-tighter text-white uppercase">
                  {portal.title}
                </h2>
                
                <p className="text-white/30 font-medium leading-relaxed mb-10 flex-grow text-sm uppercase tracking-tight">
                  {portal.description}
                </p>

                <div className="mt-auto flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.4em] uppercase text-white/20 group-hover:text-white transition-all duration-500">
                  <span>Enter Experience</span>
                  <ArrowRight className="w-4 h-4 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bottom Social / Info Badge */}
        <footer className="mt-40 opacity-10 hover:opacity-100 transition-opacity duration-1000 flex flex-col items-center gap-4">
           <div className="w-[1px] h-24 bg-gradient-to-b from-white to-transparent mb-6" />
           <p className="text-[9px] font-black uppercase tracking-[0.6em]">Dream Makers Studio © 2026</p>
        </footer>
      </main>
    </div>
  );
}
