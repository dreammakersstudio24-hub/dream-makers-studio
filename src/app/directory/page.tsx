'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { MapPin, Search, Mail, Phone, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Contractor {
  id: string
  company_name: string
  country: string
  city: string
  description: string
  contact_email: string
  phone_number: string
}

export default function DirectoryPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState('')
  const [searchCountry, setSearchCountry] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchContractors() {
      setLoading(true)
      
      let query = supabase
        .from('contractors')
        .select('id, company_name, country, city, description, contact_email, phone_number')
        .eq('is_active', true)
        
      if (searchCity) {
        query = query.ilike('city', `%${searchCity}%`)
      }
      if (searchCountry) {
        query = query.ilike('country', `%${searchCountry}%`)
      }

      const { data, error } = await query
      
      if (!error && data) {
         setContractors(data)
      }
      setLoading(false)
    }

    // Debounce the fetch slightly if user is typing
    const timeout = setTimeout(fetchContractors, 300)
    return () => clearTimeout(timeout)
  }, [searchCity, searchCountry, supabase])


  return (
    <div className="min-h-[100dvh] bg-black text-white relative">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-wide uppercase">D.M. STUDIO</Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center text-sm tracking-widest text-neutral-400">
             <Link href="/contractors/join" className="hover:text-white transition-colors">For Contractors</Link>
          </div>

          {/* Mobile Menu Toggle */}
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
               <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-400 transition-colors">HOME</Link>
               <Link href="/contractors/join" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-400 transition-colors">FOR CONTRACTORS</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">Professional <span className="text-neutral-500 font-serif italic">Directory</span></h1>
          <p className="text-neutral-400 font-light max-w-2xl">
            Find vetted, premium contractors for your next design project. Filter by your location to match with the best talent near you.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-12 grid md:grid-cols-2 gap-4">
           <div className="relative">
             <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
             <input 
               type="text" 
               placeholder="Search by Country..." 
               value={searchCountry}
               onChange={(e) => setSearchCountry(e.target.value)}
               className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white/30"
             />
           </div>
           <div className="relative">
             <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
             <input 
               type="text" 
               placeholder="Search by City or Province..." 
               value={searchCity}
               onChange={(e) => setSearchCity(e.target.value)}
               className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white/30"
             />
           </div>
        </div>

        {/* Directory Listing */}
        {loading ? (
           <div className="text-center text-neutral-500 py-12">Loading professionals...</div>
        ) : contractors.length === 0 ? (
           <div className="text-center py-24 bg-neutral-900/50 border border-white/5 rounded-3xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-light tracking-wide mb-2">No contractors found</h3>
              <p className="text-neutral-500 text-sm">Try adjusting your search criteria</p>
           </div>
        ) : (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {contractors.map((contractor) => (
                <div key={contractor.id} className="bg-neutral-900 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors group flex flex-col h-full">
                   <div className="mb-4">
                      <h3 className="text-xl font-medium tracking-wide mb-2">{contractor.company_name}</h3>
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        {contractor.city}, {contractor.country}
                      </div>
                   </div>
                   
                   <p className="text-sm text-neutral-500 leading-relaxed mb-8 flex-grow">
                     {contractor.description || "Premium contractor associated with D.M. Studio."}
                   </p>

                   <div className="space-y-3 pt-6 border-t border-white/10">
                     <a href={`mailto:${contractor.contact_email}`} className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                        {contractor.contact_email}
                     </a>
                     {contractor.phone_number && (
                        <a href={`tel:${contractor.phone_number}`} className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors">
                          <Phone className="w-4 h-4" />
                          {contractor.phone_number}
                        </a>
                     )}
                   </div>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  )
}
