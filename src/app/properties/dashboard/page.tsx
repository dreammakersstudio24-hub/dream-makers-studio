import { createServerSupabaseClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { createOrUpdateProperty } from "@/actions/properties"
import { ImageIcon } from "lucide-react"

export default async function PropertyDashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!property) {
     redirect('/properties/join')
  }

  const isComplete = property.title && property.image_url;

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-light mb-2 tracking-wide">Listing Dashboard</h1>
        <p className="text-neutral-500 mb-8">Manage your exclusive property listing.</p>

        {!property.is_active && (
           <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm rounded-xl mb-8 flex justify-between items-center">
              <span>Your property subscription is inactive. Your listing is hidden from buyers.</span>
           </div>
        )}

        {!isComplete && property.is_active && (
           <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm rounded-xl mb-8">
              Welcome! Please fill in the details and upload an image to activate your listing.
           </div>
        )}

        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
          <form action={createOrUpdateProperty} className="space-y-6">
            <h3 className="text-lg font-medium tracking-wide border-b border-white/10 pb-4 mb-6">Property Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="title">Catchy Headline *</label>
                 <input 
                   id="title" name="title" type="text" required
                   defaultValue={property.title || ""}
                   placeholder="e.g. Minimalist Villa in the Heart of Sukhumvit"
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="price">Price *</label>
                 <input 
                   id="price" name="price" type="text" required
                   defaultValue={property.price || ""}
                   placeholder="e.g. 15,000,000 THB or $500,000"
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>

                <div className="space-y-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="location">Location (City/Neighborhood) *</label>
                 <input 
                   id="location" name="location" type="text" required
                   defaultValue={property.location || ""}
                   placeholder="e.g. Thong Lo, Bangkok"
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="description">Full Description</label>
              <textarea 
                id="description" name="description" rows={5}
                defaultValue={property.description || ""}
                placeholder="Highlight the architectural style, land size, amenities, and why this property is unique."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 resize-none"
              ></textarea>
            </div>

            <h3 className="text-lg font-medium tracking-wide border-b border-white/10 pb-4 mb-6 mt-8">Property Media</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="image">Cover Image (required for new listings)</label>
              <div className="flex items-center gap-6">
                {property.image_url ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={property.image_url} alt="Current listing" className="w-32 h-32 object-cover rounded-xl border border-white/10" />
                ) : (
                   <div className="w-32 h-32 bg-black border border-white/10 rounded-xl flex items-center justify-center text-neutral-600">
                     <ImageIcon className="w-8 h-8 opacity-50" />
                   </div>
                )}
                
                <input 
                  id="image" name="image" type="file" accept="image/*"
                  // Require image only if it hasn't been uploaded yet
                  required={!property.image_url} 
                  className="text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-neutral-200 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex justify-end">
               <button type="submit" className="px-8 py-3 bg-white text-black rounded-xl font-medium tracking-wide hover:bg-neutral-200 transition-colors">
                  Publish Listing
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
