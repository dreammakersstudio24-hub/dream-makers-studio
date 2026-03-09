'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Home, CheckCircle2, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'

export default function PropertiesJoinPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/properties/checkout', {
        method: 'POST',
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <a href="/" className="text-xl font-light tracking-wide uppercase">D.M. STUDIO</a>
      </nav>

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Copy */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-widest uppercase mb-6 text-neutral-400">
             <Building2 className="w-3.5 h-3.5" /> For Real Estate Brokers & Owners
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
            Showcase Your <span className="font-serif italic text-neutral-400">Premium Real Estate</span>
          </h1>
          
          <p className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-xl">
            List your luxury properties directly to our audience of home design enthusiasts. 
            Connect with buyers actively seeking high-end living spaces.
          </p>

          <div className="space-y-6">
            {[
               { title: "Targeted Audience", desc: "Reach clients already looking to invest in home aesthetics." },
               { title: "Premium Presentation", desc: "Your listings displayed in our signature minimalist, luxury design." },
               { title: "Direct Leads", desc: "Buyers contact you directly. We take zero commission on sales." }
            ].map((feature, i) => (
               <div key={i} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-neutral-500" /></div>
                  <div>
                    <h3 className="font-medium tracking-wide mb-1">{feature.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
                  </div>
               </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Pricing Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center text-center w-full max-w-md mx-auto"
        >
          <div className="absolute top-0 right-0 bg-white/5 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-bl-xl text-neutral-400">
            Monthly
          </div>
          
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 mt-4">
            <Home className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-light mb-2">Property Listing</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-light">$10</span>
            <span className="text-neutral-500 text-sm">/ month</span>
          </div>
          
          <p className="text-sm text-neutral-400 mb-8 w-full">
            List 1 property for 30 days. Cancel anytime. Auto-renews to keep your listing active.
          </p>

          {error && (
            <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl mb-6">
              {error}
            </div>
          )}

          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-medium tracking-widest text-sm rounded-xl hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "PROCESSING..." : "SUBSCRIBE NOW"} {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <p className="text-xs text-neutral-600 mt-6 uppercase tracking-widest">
            Secure Payment Powered by Stripe
          </p>
        </motion.div>
      </div>
    </div>
  )
}
