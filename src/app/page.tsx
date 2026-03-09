"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Image as ImageIcon, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-light tracking-widest uppercase">
            Dream<span className="font-semibold text-neutral-400">Makers</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm tracking-widest text-neutral-400">
             <Link href="#gallery" className="hover:text-white transition-colors">Gallery</Link>
             <Link href="/ebook" className="hover:text-white transition-colors">E-Book</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-light leading-tight mb-6">
              Transform Your Space Into a <span className="italic text-neutral-400">Masterpiece</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-10 max-w-xl leading-relaxed">
              Discover the secrets of luxury interior design and browse our exclusive gallery of home transformations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/ebook" className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors">
                Get the E-Book
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#gallery" className="flex items-center gap-2 bg-white/5 text-white px-8 py-4 rounded-full text-sm tracking-widest border border-white/10 hover:bg-white/10 transition-colors">
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />
      </section>

      {/* Featured Gallery Preview */}
      <section id="gallery" className="py-24 px-6 border-t border-white/5 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-light mb-4">Featured Transformations</h2>
              <p className="text-neutral-400">A glimpse into our most stunning projects.</p>
            </div>
            <Link href="/gallery" className="hidden md:flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 rounded-2xl"
              >
                <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Modern Minimalist</h3>
                    <p className="text-sm text-neutral-400">Living Room</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Book CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-neutral-900/0 to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-light mb-6">The Ultimate Design Guide</h2>
            <p className="text-neutral-400 max-w-xl mb-10 text-lg">
              Learn the exact framework we use to transform any space. Over 50 pages of actionable advice, layouts, and sourcing secrets.
            </p>
            <div className="flex items-center gap-2 mb-8 text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              <span className="text-neutral-400 text-sm ml-2">Trusted by 2,000+ readers</span>
            </div>
            <Link href="/ebook" className="bg-white text-black px-10 py-5 rounded-full text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors w-full md:w-auto">
              Purchase for $29
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-white/10 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} Dream Makers Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
