import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, History, ImageIcon, Download, Settings, Crown, ChevronLeft } from 'lucide-react'
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
      <main className="px-6 pt-12 space-y-12 max-w-lg mx-auto overflow-hidden">
         
         {/* Premium Header */}
         <header className="text-center space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
               Transform <br/> 
               <span className="text-neutral-400">Your Space</span>
            </h2>
            <p className="text-sm text-neutral-400 font-bold uppercase tracking-[0.3em]">AI Selection Center</p>
         </header>

         {/* Credit / Status Bar (Glassmorphism) */}
         <div className="mx-auto flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] px-8 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${hasCredits ? 'bg-black text-white' : 'bg-red-50 text-red-600'}`}>
                  <Crown className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none mb-1">Total Balance</p>
                  <p className="text-xl font-black text-neutral-900">{credits} <span className="text-xs font-bold text-neutral-400 ml-1">Credits</span></p>
               </div>
            </div>
            {!hasCredits && (
               <button className="text-[11px] font-black text-red-600 uppercase tracking-widest bg-red-100/50 px-4 py-2 rounded-xl">Purchase</button>
            )}
         </div>

         {/* The "WOW" Launchpad Cards */}
         <section className="grid gap-6">
            
            {/* Interior Transformation Card */}
            <Link 
               href="/app/generate"
               className="group relative h-64 rounded-[3rem] overflow-hidden bg-neutral-900 shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 border border-black/5"
            >
               {/* High-res Image with Parallax-like feel */}
               <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41fa33a8?q=80&w=800&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[2000ms] ease-out" 
                  alt="Interior"
               />
               {/* Dynamic Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
               
               {/* Content */}
               <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                  <div className="flex items-center gap-2 mb-3 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Ready to Redesign</span>
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-1">Interior <span className="text-white/40">Studio</span></h3>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Rooms, Kitchens, Suites</p>
               </div>

               {/* Decorative Element */}
               <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                  <ChevronLeft className="w-6 h-6 text-white rotate-180" />
               </div>
            </Link>

            {/* Garden & Exterior Card */}
            <Link 
               href="/app/garden"
               className="group relative h-64 rounded-[3rem] overflow-hidden bg-emerald-950 shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 border border-black/5"
            >
               <img 
                  src="https://images.unsplash.com/photo-1558904541-efa8c1ae65f4?q=80&w=800&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[2000ms] ease-out" 
                  alt="Garden"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-emerald-950/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
               
               <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                  <div className="flex items-center gap-2 mb-3 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <Crown className="w-4 h-4 text-emerald-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Luxury Landscaping</span>
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-1">Garden <span className="text-white/40">& Pool</span></h3>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Backyards, Patios, Zen</p>
               </div>

               <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                  <ChevronLeft className="w-6 h-6 text-white rotate-180" />
               </div>
            </Link>

         </section>

         {/* Secondary Minimalist Links */}
         <div className="flex justify-center gap-8 pb-10">
            <Link href="/history" className="flex flex-col items-center gap-2 group">
               <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all group-hover:-translate-y-1">
                  <History className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">History</span>
            </Link>
            <Link href="/shop" className="flex flex-col items-center gap-2 group">
               <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:-translate-y-1">
                  <Download className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Shop</span>
            </Link>
            <form action={logout}>
               <button className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all group-hover:-translate-y-1">
                     <Settings className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Settings</span>
               </button>
            </form>
         </div>

      </main>
    </div>
  )
}
