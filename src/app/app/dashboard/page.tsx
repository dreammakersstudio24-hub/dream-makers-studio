import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, History, ImageIcon, Download, Settings, Crown } from 'lucide-react'
import { logout } from '@/actions/auth'
export const metadata = {
  title: 'Dashboard - Transformation App',
}

export default async function MobileDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/app')
  }

  // Fetch Credits
  const { data: userMeta } = await supabase
    .from('users_metadata')
    .select('credits')
    .eq('id', session.user.id)
    .single()

  const credits = userMeta?.credits || 0
  const hasCredits = credits > 0

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-24 font-sans selection:bg-black/10">
      
      {/* Settings / Logout Bar */}
      <div className="px-6 pt-24 pb-2 flex justify-end">
          <form action={logout}>
            <button className="w-10 h-10 bg-white shadow-sm border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors">
               <Settings className="w-5 h-5" />
            </button>
         </form>
      </div>

      <main className="px-6 pt-8 space-y-10 max-w-lg mx-auto">
         
         {/* Credit Status Bar (Slim & Premium) */}
         <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-3xl px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasCredits ? 'bg-black text-white' : 'bg-red-50 text-red-600'}`}>
                  <Crown className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Available Balance</p>
                  <p className="font-bold text-neutral-900">{credits} Credits</p>
               </div>
            </div>
            {!hasCredits && (
               <button className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg">Top Up</button>
            )}
         </div>

         {/* Launchpad Section */}
         <section className="space-y-6">
            <div className="space-y-1">
               <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Transform Your Space</h2>
               <p className="text-sm text-neutral-500 font-medium">Choose a project type to begin</p>
            </div>

            <div className="grid gap-4">
               {/* Interior Card */}
               <Link 
                  href="/app/generate"
                  className="group relative h-48 rounded-[2.5rem] overflow-hidden bg-neutral-900 shadow-xl transition-all hover:scale-[1.02] active:scale-95 border border-white/10"
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img 
                     src="https://images.unsplash.com/photo-1618221195710-dd6b41fa33a8?q=80&w=600&auto=format&fit=crop" 
                     className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                     alt="Interior"
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                     <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Dream Makers Studio</span>
                     </div>
                     <h3 className="text-2xl font-bold text-white tracking-tight">Interior Redesign</h3>
                     <p className="text-sm text-white/50 font-medium">Living room, bedroom, and more</p>
                  </div>
               </Link>

               {/* Garden Card */}
               <Link 
                  href="/app/garden"
                  className="group relative h-48 rounded-[2.5rem] overflow-hidden bg-neutral-800 shadow-xl transition-all hover:scale-[1.02] active:scale-95 border border-white/10"
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img 
                     src="https://images.unsplash.com/photo-1558904541-efa8c1ae65f4?q=80&w=600&auto=format&fit=crop" 
                     className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                     alt="Garden"
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                     <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-green-400" />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Exterior & Luxury</span>
                     </div>
                     <h3 className="text-2xl font-bold text-white tracking-tight">Garden & Outdoor</h3>
                     <p className="text-sm text-white/50 font-medium">Pools, patios, and landscaping</p>
                  </div>
               </Link>
            </div>
         </section>

         {/* Stats / History Bar */}
         <div className="grid grid-cols-2 gap-4">
            <Link 
               href="/history"
               className="bg-white border border-neutral-100 p-6 rounded-3xl flex items-center gap-4 hover:shadow-md transition-all active:scale-95 group"
            >
               <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <History className="w-5 h-5" />
               </div>
               <div>
                  <p className="font-bold text-neutral-900 leading-none mb-1">History</p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Past results</p>
               </div>
            </Link>

            <Link 
               href="/shop"
               className="bg-white border border-neutral-100 p-6 rounded-3xl flex items-center gap-4 hover:shadow-md transition-all active:scale-95 group"
            >
               <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
               </div>
               <div>
                  <p className="font-bold text-neutral-900 leading-none mb-1">Shop</p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Interior kits</p>
               </div>
            </Link>
         </div>

      </main>
    </div>
  )
}
