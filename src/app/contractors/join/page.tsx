'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ContractorJoinPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contractor/checkout', {
        method: 'POST',
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wide">Grow Your <span className="text-neutral-500 font-serif italic">Business</span></h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Join our exclusive directory of top-tier contractors. Connect with clients looking for premium home transformations in your city.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-2xl font-light tracking-wide">Why Join D.M. Studio?</h2>
            
            <ul className="space-y-6">
              <li className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <h4 className="font-medium tracking-wide mb-1">Premium Lead Generation</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">Get discovered by clients actively seeking high-end renovation services in your specific area.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <h4 className="font-medium tracking-wide mb-1">Exclusive Directory</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">Stand out in a curated list of professionals. No bidding wars, just quality connections.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <h4 className="font-medium tracking-wide mb-1">Instant Credibility</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">Align your brand with our premium design aesthetic and established audience.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 bg-white/5 rounded-bl-3xl border-b border-l border-white/10">
                <span className="text-xs font-medium tracking-widest uppercase text-neutral-400">Monthly</span>
             </div>
             
             <h3 className="text-xl font-light tracking-wide mb-2">Professional Listing</h3>
             <div className="flex items-baseline gap-2 mb-6">
               <span className="text-4xl font-light">฿990</span>
               <span className="text-neutral-500 text-sm">/ month</span>
             </div>
             
             <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
               Cancel anytime. You must be logged into your account to subscribe.
             </p>

             {error && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl mb-6">
                 {error}
                 {error.includes("logged in") && (
                    <Link href="/login" className="block mt-2 underline text-white">Go to Login</Link>
                 )}
               </div>
             )}

             <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-xl text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
             >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>SUBSCRIBE NOW <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
             </button>
             <p className="text-center text-xs text-neutral-600 mt-4 tracking-wide uppercase">Secure payment powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  )
}
