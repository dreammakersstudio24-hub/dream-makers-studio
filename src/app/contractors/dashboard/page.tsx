import { createServerSupabaseClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { updateContractorProfile } from "@/actions/contractors"

export default async function ContractorDashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: contractor } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!contractor) {
     redirect('/contractors/join')
  }

  const isComplete = contractor.company_name && contractor.country && contractor.city;

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-light mb-2 tracking-wide">Contractor Dashboard</h1>
        <p className="text-neutral-500 mb-8">Manage your public directory profile.</p>

        {!contractor.is_active && (
           <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm rounded-xl mb-8 flex justify-between items-center">
              <span>Your subscription is currently inactive or pending. Your profile will not appear in the directory until payment is confirmed.</span>
           </div>
        )}

        {!isComplete && contractor.is_active && (
           <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm rounded-xl mb-8">
              Welcome! Please complete your profile below so clients can find you in the directory.
           </div>
        )}

        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
          <form action={updateContractorProfile} className="space-y-6">
            <h3 className="text-lg font-medium tracking-wide border-b border-white/10 pb-4 mb-6">Business Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="company_name">Company Name *</label>
                 <input 
                   id="company_name" name="company_name" type="text" required
                   defaultValue={contractor.company_name || ""}
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="contact_email">Public Contact Email *</label>
                 <input 
                   id="contact_email" name="contact_email" type="email" required
                   defaultValue={contractor.contact_email || user.email}
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="phone_number">Phone Number</label>
                 <input 
                   id="phone_number" name="phone_number" type="tel"
                   defaultValue={contractor.phone_number || ""}
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>
            </div>

            <h3 className="text-lg font-medium tracking-wide border-b border-white/10 pb-4 mb-6 mt-8">Location & Details</h3>
            
             <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="country">Country *</label>
                 <input 
                   id="country" name="country" type="text" required
                   defaultValue={contractor.country || ""}
                   placeholder="e.g. Thailand"
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>
                <div className="space-y-2">
                 <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="city">City / Province *</label>
                 <input 
                   id="city" name="city" type="text" required
                   defaultValue={contractor.city || ""}
                   placeholder="e.g. Bangkok"
                   className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30"
                 />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium tracking-wide text-neutral-400" htmlFor="description">About Your Services</label>
              <textarea 
                id="description" name="description" rows={4}
                defaultValue={contractor.description || ""}
                placeholder="Describe your expertise, past projects, and what makes your company unique..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 resize-none"
              ></textarea>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
               <button type="submit" className="px-8 py-3 bg-white text-black rounded-xl font-medium tracking-wide hover:bg-neutral-200 transition-colors">
                  Save Profile
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
