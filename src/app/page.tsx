"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Map, Building2, BookOpen } from "lucide-react";

export default function Home() {
  const portalLinks = [
    {
      title: "Design Gallery",
      description: "Explore our curated collection of luxury interior inspirations and shop the looks.",
      icon: <ImageIcon className="w-8 h-8 text-blue-600 mb-6" />,
      href: "/gallery",
      color: "from-blue-50 to-white",
      borderColor: "group-hover:border-blue-300",
      accent: "bg-blue-600",
      delay: 0.1
    },
    {
      title: "Premium Directory",
      description: "Connect with elite contractors and artisans vetted by our studio.",
      icon: <Map className="w-8 h-8 text-orange-500 mb-6" />,
      href: "/directory",
      color: "from-orange-50 to-white",
      borderColor: "group-hover:border-orange-300",
      accent: "bg-orange-500",
      delay: 0.2
    },
    {
      title: "Exclusive Real Estate",
      description: "Discover spectacular homes that match your impeccable design taste.",
      icon: <Building2 className="w-8 h-8 text-light-blue-600 mb-6" />,
      href: "/real-estate",
      color: "from-sky-50 to-white",
      borderColor: "group-hover:border-light-blue-300",
      accent: "bg-light-blue-600",
      delay: 0.3
    },
    {
      title: "Masterclass E-Book",
      description: "Learn the secrets of luxury interior design with our comprehensive digital guide.",
      icon: <BookOpen className="w-8 h-8 text-indigo-600 mb-6" />,
      href: "/ebook",
      color: "from-indigo-50 to-white",
      borderColor: "group-hover:border-indigo-300",
      accent: "bg-indigo-600",
      delay: 0.4
    },
    {
      title: "AI Room Designer",
      description: "Instantly reimagine your space with our advanced AI staging technology.",
      icon: <ImageIcon className="w-8 h-8 text-rose-500 mb-6" />, // Reusing icon for simplicity, you might want a Wand or Sparkles icon later
      href: "/app",
      color: "from-rose-50 to-white",
      borderColor: "group-hover:border-rose-300",
      accent: "bg-rose-500",
      delay: 0.5
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-white text-neutral-900 selection:bg-blue-100 relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Graphic Elements */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-50 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[50vh] h-[50vh] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vh] h-[40vh] bg-orange-100 rounded-full blur-[100px] opacity-60 pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 w-full pt-32">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-500 tracking-widest uppercase mb-6 shadow-sm bg-white">
              Welcome to the Studio
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-light mb-6 tracking-tight text-neutral-900"
          >
            Turning <span className="font-serif italic text-blue-900 font-medium">Ideas</span> into <span className="text-orange-500 font-medium relative whitespace-nowrap">Reality<svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10 opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="8" fill="none"/></svg></span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-500 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Your ultimate destination for curated luxury design inspiration, vetted professional contractors, and exclusive real estate.
          </motion.p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {portalLinks.map((portal) => (
            <Link href={portal.href} key={portal.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: portal.delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group h-full p-8 sm:p-10 rounded-3xl bg-gradient-to-br ${portal.color} border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col ${portal.borderColor}`}
              >
                {/* Decorative background accent */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-neutral-200/50 opacity-20 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className={`w-8 h-8 rounded-full ${portal.accent} text-white flex items-center justify-center shadow-lg`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {portal.icon}
                
                <h2 className="text-2xl font-bold mb-3 tracking-wide text-neutral-900 group-hover:text-blue-900 transition-colors">
                  {portal.title}
                </h2>
                
                <p className="text-neutral-500 font-light leading-relaxed mb-8 flex-grow">
                  {portal.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
