'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { MapPin, Search } from 'lucide-react'
import Link from 'next/link'

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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    <div className="min-h-[100dvh] bg-black text-white relative">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <Link href="/" className="text-xl font-light tracking-wide uppercase">D.M. STUDIO</Link>
        <div className="flex gap-6">
           <Link href="/directory" className="text-sm tracking-widest uppercase hover:text-neutral-400 transition-colors hidden md:block">Contractors</Link>
           <Link href="/properties/join" className="text-sm tracking-widest uppercase hover:text-neutral-400 transition-colors">List Your Property</Link>
        </div>
      </nav>
      
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">Exclusive <span className="text-neutral-500 font-serif italic">Real Estate</span></h1>
          <p className="text-neutral-400 font-light max-w-2xl">
            Discover premium properties curated for design-conscious buyers. Connecting you directly with owners and top-tier brokers.
          </p>
        </div>

        {/* Search */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-12 max-w-md">
           <div className="relative">
             <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
             <input 
               type="text" 
               placeholder="Search by Location (e.g. Sukhumvit)" 
               value={searchLocation}
               onChange={(e) => setSearchLocation(e.target.value)}
               className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white/30"
             />
           </div>
        </div>

        {/* Directory Listing */}
        {loading ? (
           <div className="text-center text-neutral-500 py-12">Loading properties...</div>
        ) : properties.length === 0 ? (
           <div className="text-center py-24 bg-neutral-900/50 border border-white/5 rounded-3xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-light tracking-wide mb-2">No properties found</h3>
              <p className="text-neutral-500 text-sm">Try adjusting your location search</p>
           </div>
        ) : (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {properties.map((property) => (
                <div key={property.id} className="group cursor-pointer">
                   <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl mb-4 bg-neutral-900 border border-white/5 relative">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                       src={property.image_url} 
                       alt={property.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                     />
                     <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium tracking-wide">
                        {property.price}
                     </div>
                   </div>
                   
                   <h3 className="text-lg font-medium tracking-wide mb-1 group-hover:text-neutral-300 transition-colors">{property.title}</h3>
                   <div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-3">
                     <MapPin className="w-3.5 h-3.5" />
                     {property.location}
                   </div>
                   
                   <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed">
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
