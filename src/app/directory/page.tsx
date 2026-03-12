'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { MapPin, Search, Mail, Phone } from 'lucide-react'

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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
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
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-900 relative">
      <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide text-neutral-900">Professional <span className="text-orange-500 font-serif italic font-medium">Directory</span></h1>
          <p className="text-neutral-500 font-light max-w-2xl text-sm sm:text-base mb-8">
            Find vetted, premium contractors for your next design project. Filter by your location to match with the best talent near you.
          </p>

          {/* Monetization CTA for Contractors */}
          <div className="bg-gradient-to-r from-blue-900 flex-col sm:flex-row flex items-center justify-between to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
             <div className="relative z-10 max-w-xl mb-6 sm:mb-0">
               <h2 className="text-2xl font-bold mb-2 tracking-wide">Are you a Premium Contractor?</h2>
               <p className="text-blue-100 font-light text-sm sm:text-base">Join our exclusive directory to get in front of high-net-worth clients worldwide. One-time verification fee applies.</p>
             </div>
             <div className="relative z-10 shrink-0 w-full sm:w-auto">
               <button 
                 onClick={async () => {
                   try {
                     const res = await fetch('/api/contractor/checkout', { method: 'POST' });
                     const data = await res.json();
                     if (data.url) window.location.href = data.url;
                   } catch(e) { console.error(e); }
                 }}
                 className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white rounded-full font-bold tracking-widest text-sm transition-colors shadow-lg"
               >
                 Join Directory ($199 USD)
               </button>
             </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12 grid md:grid-cols-2 gap-4">
           <div className="relative">
             <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
             <input 
               type="text" 
               placeholder="Search by Country..." 
               value={searchCountry}
               onChange={(e) => setSearchCountry(e.target.value)}
               className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 text-neutral-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-neutral-400 text-sm sm:text-base"
             />
           </div>
           <div className="relative">
             <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
             <input 
               type="text" 
               placeholder="Search by City or Province..." 
               value={searchCity}
               onChange={(e) => setSearchCity(e.target.value)}
               className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 text-neutral-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-neutral-400 text-sm sm:text-base"
             />
           </div>
        </div>

        {/* Directory Listing */}
        {loading ? (
           <div className="text-center text-neutral-500 py-12">Loading professionals...</div>
        ) : contractors.length === 0 ? (
           <div className="text-center py-24 bg-white border border-neutral-200 shadow-sm rounded-3xl">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium tracking-wide mb-2 text-neutral-900">No contractors found</h3>
              <p className="text-neutral-500 text-sm">Try adjusting your search criteria</p>
           </div>
        ) : (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
             {contractors.map((contractor) => (
                <div key={contractor.id} className="bg-white border border-neutral-200 shadow-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full">
                   <div className="mb-4">
                      <h3 className="text-xl font-semibold tracking-wide mb-2 text-blue-950 group-hover:text-blue-700 transition-colors">{contractor.company_name}</h3>
                      <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        {contractor.city}, {contractor.country}
                      </div>
                   </div>
                   
                   <p className="text-sm text-neutral-600 leading-relaxed mb-8 flex-grow">
                     {contractor.description || "Premium contractor associated with Dream Makers Studio."}
                   </p>

                   <div className="space-y-3 pt-6 border-t border-neutral-100">
                     <a href={`mailto:${contractor.contact_email}`} className="flex items-center gap-3 text-sm text-neutral-500 hover:text-blue-600 font-medium transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <Mail className="w-4 h-4" />
                        </div>
                        {contractor.contact_email}
                     </a>
                     {contractor.phone_number && (
                        <a href={`tel:${contractor.phone_number}`} className="flex items-center gap-3 text-sm text-neutral-500 hover:text-blue-600 font-medium transition-colors">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Phone className="w-4 h-4" />
                          </div>
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
