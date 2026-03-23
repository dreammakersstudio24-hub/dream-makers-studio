"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Layout, Package, BookOpen } from "lucide-react";

export default function Home() {
  const portals = [
    {
      title: "AI Studio",
      description: "Transform your room or garden with AI — results in seconds.",
      icon: <Sparkles className="w-7 h-7 text-blue-600" />,
      href: "/app",
      bg: "bg-blue-50",
      border: "border-blue-100",
      delay: 0.1,
    },
    {
      title: "Design Gallery",
      description: "Browse curated luxury interior inspirations.",
      icon: <Layout className="w-7 h-7 text-emerald-600" />,
      href: "/gallery",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      delay: 0.2,
    },
    {
      title: "Shop",
      description: "Handpicked furniture and décor for your home.",
      icon: <Package className="w-7 h-7 text-orange-600" />,
      href: "/shop",
      bg: "bg-orange-50",
      border: "border-orange-100",
      delay: 0.3,
    },
    {
      title: "E-Book",
      description: "50 AI prompts for stunning garden and backyard designs.",
      icon: <BookOpen className="w-7 h-7 text-indigo-600" />,
      href: "/ebook",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      delay: 0.4,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans">
      <main className="max-w-3xl mx-auto px-5 py-24 sm:py-32 flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-[11px] font-bold uppercase tracking-wider text-neutral-500"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Dream Makers Studio
        </motion.div>

        {/* Hero */}
        <div className="text-center mb-14 space-y-4 max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight"
          >
            Turning Concepts<br />
            <span className="text-neutral-400 font-medium">Into Reality.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-base leading-relaxed"
          >
            Luxury design inspiration and AI-powered tools for your home.
          </motion.p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {portals.map((portal) => (
            <Link href={portal.href} key={portal.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: portal.delay }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full`}
              >
                <div className={`w-12 h-12 rounded-2xl ${portal.bg} ${portal.border} border flex items-center justify-center mb-4`}>
                  {portal.icon}
                </div>
                <h2 className="text-lg font-bold mb-1 text-neutral-900">{portal.title}</h2>
                <p className="text-neutral-500 text-sm leading-relaxed flex-grow">{portal.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-neutral-400 group-hover:text-neutral-700 transition-colors">
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <footer className="mt-20 text-[10px] text-neutral-300 font-medium uppercase tracking-widest text-center">
          Dream Makers Studio © 2026
        </footer>
      </main>
    </div>
  );
}
