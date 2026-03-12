'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { MapPin, Search } from 'lucide-react'

interface Property {
  id: string
  title: string
  location: string
  price: string
  description: string
  image_url: string
}

export default function RealEstateDirectoryPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
  )

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)
      
      let query = supabase
        .from('properties')
        .select('id, title, location, price, description, image_url')
        .eq('is_active', true)
        // Must have an image and title to be worth showing publicly
        .not('image_url', 'is', null) 
        .not('title', 'is', null)
        
      if (searchLocation) {
        query = query.ilike('location', `%${searchLocation}%`)
      }

      const { data, error } = await query
      
      if (!error && data) {
         setProperties(data)
      }
      setLoading(false)
    }

    const timeout = setTimeout(fetchProperties, 300)
    return () => clearTimeout(timeout)
  }, [searchLocation, supabase])


  return (
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-900 relative">
      <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide text-neutral-900">Exclusive <span className="text-orange-500 font-serif italic font-medium">Real Estate</span></h1>
          <p className="text-neutral-500 font-light max-w-2xl text-sm sm:text-base mb-8">
            Discover premium properties curated for design-conscious buyers. Connecting you directly with owners and top-tier brokers.
          </p>

          {/* Monetization CTA for Real Estate */}
          <div className="bg-gradient-to-r from-neutral-900 flex-col sm:flex-row flex items-center justify-between to-neutral-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex-wrap gap-6">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
             <div className="relative z-10 max-w-xl">
               <h2 className="text-2xl font-bold mb-2 tracking-wide text-orange-400">List Your Luxury Property</h2>
               <p className="text-neutral-300 font-light text-sm sm:text-base">Reach our curated audience of high-net-worth buyers and international design enthusiasts. One-time listing fee applies.</p>
             </div>
             <div className="relative z-10 shrink-0 w-full sm:w-auto">
               <button 
                 onClick={async () => {
                   try {
                     const res = await fetch('/api/properties/checkout', { method: 'POST' });
                     const data = await res.json();
                     if (data.url) window.location.href = data.url;
                   } catch(e) { console.error(e); }
                 }}
                 className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-100 text-neutral-900 rounded-full font-bold tracking-widest text-sm transition-colors shadow-lg"
               >
                 List Property ($299 USD)
               </button>
             </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12 max-w-md">
           <div className="relative">
             <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
             <input 
               type="text" 
               placeholder="Search by Location (e.g. Sukhumvit)" 
               value={searchLocation}
               onChange={(e) => setSearchLocation(e.target.value)}
               className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 text-neutral-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-neutral-400 text-sm sm:text-base"
             />
           </div>
        </div>

        {/* Directory Listing */}
        {loading ? (
           <div className="text-center text-neutral-500 py-12">Loading properties...</div>
        ) : properties.length === 0 ? (
           <div className="text-center py-24 bg-white border border-neutral-200 shadow-sm rounded-3xl">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium tracking-wide mb-2 text-neutral-900">No properties found</h3>
              <p className="text-neutral-500 text-sm">Try adjusting your location search</p>
           </div>
        ) : (
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
             {properties.map((property) => (
                <div key={property.id} className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                   <div className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-6 bg-neutral-100 relative">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                       src={property.image_url} 
                       alt={property.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                     />
                     <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold tracking-wide text-blue-900 shadow-sm">
                        {property.price}
                     </div>
                   </div>
                   
                   <h3 className="text-lg font-semibold tracking-wide mb-2 group-hover:text-blue-600 transition-colors text-blue-950">{property.title}</h3>
                   <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-4 font-medium">
                     <MapPin className="w-4 h-4 text-orange-400" />
                     {property.location}
                   </div>
                   
                   <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                     {property.description}
                   </p>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  )
}
