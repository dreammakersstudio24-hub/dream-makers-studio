import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, History, Download, Crown, Armchair, Flame, Home, LogOut } from 'lucide-react'
import { logout } from '@/actions/auth'
import { PwaInstallBanner } from '@/components/PwaInstallBanner'

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
    <div className="min-h-screen bg-[#0f1115] text-white pb-32 font-sans selection:bg-white/10 overflow-x-hidden">
      
      {/* Premium Launcher Body */}
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
         
          {/* Title Section & Logout */}
          <header className="relative text-center space-y-2">
             {/* Logout button — top right, clearly labeled */}
             <div className="absolute right-0 top-0">
                <form action={logout}>
                   <button
                     type="submit"
                     className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                   >
                     <LogOut className="w-3.5 h-3.5" />
                     <span className="text-[10px] font-bold uppercase tracking-wide">Logout</span>
                   </button>
                </form>
             </div>

             <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center border border-yellow-400/50 shadow-[0_0_12px_rgba(250,204,21,0.3)]">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/70">Dream Makers Studio AI</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white leading-none">
               Transform <span className="text-white/40 font-medium">Your Space</span>
            </h1>
          </header>

          {/* PWA Install Banner — inline, no popup */}
          <PwaInstallBanner />

         {/* 2-Column Grid Transformation Choices */}
         <section className="grid grid-cols-2 gap-5 pt-4">
            
            {/* Interior Transformation Card */}
            <Link 
               href="/app/generate"
               className="group relative aspect-[0.75/1] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.04] active:scale-95 bg-neutral-900 border border-white/5"
            >
               {/* Premium Generated Asset */}
               <img 
                  src="/dashboard-interior.png" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[4000ms]" 
                  alt="Interior"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/10 to-transparent z-10" />
               
               {/* Glowing Center Icon */}
               <div className="absolute inset-0 flex items-center justify-center z-20">
                   <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:border-blue-400/50 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all">
                       <Armchair className="w-8 h-8 text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]" />
                   </div>
               </div>

               {/* Bottom Content */}
               <div className="absolute inset-x-0 bottom-0 p-6 text-center z-20 space-y-1">
                  <h3 className="text-lg font-black text-white tracking-tight leading-none shadow-black drop-shadow-lg">Interior <span className="text-white/40 italic">Redesign</span></h3>
                  <p className="text-[9px] text-white/60 font-medium leading-tight drop-shadow-md">Create stunning, personalized living spaces.</p>
               </div>
            </Link>

            {/* Garden & Exterior Card */}
            <Link 
               href="/app/garden"
               className="group relative aspect-[0.75/1] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.04] active:scale-95 bg-neutral-900 border border-white/5"
            >
               {/* Premium Generated Asset */}
               <img 
                  src="/dashboard-garden.png" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[4000ms]" 
                  alt="Garden"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/10 to-transparent z-10" />
               
               {/* Glowing Center Icon */}
               <div className="absolute inset-0 flex items-center justify-center z-20">
                   <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:border-orange-400/50 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-all">
                       <Flame className="w-8 h-8 text-orange-300 drop-shadow-[0_0_8px_rgba(253,186,116,0.8)]" />
                   </div>
               </div>

               {/* Bottom Content */}
               <div className="absolute inset-x-0 bottom-0 p-6 text-center z-20 space-y-1">
                  <h3 className="text-lg font-black text-white tracking-tight leading-none shadow-black drop-shadow-lg">Garden <span className="text-white/40 italic">& Outdoor</span></h3>
                  <p className="text-[9px] text-white/60 font-medium leading-tight drop-shadow-md">Design dream patios, gardens & outdoor retreats.</p>
               </div>
            </Link>

         </section>

         {/* "Popular Tools" Minimalist List */}
         <div className="space-y-6 pt-4">
            <h2 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] text-center">Popular tools</h2>
            <div className="grid grid-cols-2 gap-4">
                <Link href="/history" className="bg-[#1a1d23] border border-white/5 p-5 rounded-3xl flex items-center justify-center gap-3 shadow-lg hover:bg-[#22262e] transition-all active:scale-95 group">
                    <History className="w-4 h-4 text-white/30 group-hover:text-white" />
                    <span className="text-xs font-bold text-white/80 tracking-tight">Style Inspiration</span>
                </Link>
                <Link href="/shop" className="bg-[#1a1d23] border border-white/5 p-5 rounded-3xl flex items-center justify-center gap-3 shadow-lg hover:bg-[#22262e] transition-all active:scale-95 group">
                    <Download className="w-4 h-4 text-white/30 group-hover:text-white" />
                    <span className="text-xs font-bold text-white/80 tracking-tight">Project History</span>
                </Link>
            </div>
         </div>

         {/* Floating Bottom Nav */}
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#1a1d23]/80 backdrop-blur-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] rounded-[2.5rem] px-8 py-5 flex items-center justify-between z-[100]">
            <Link href="/app/dashboard" className="flex flex-col items-center gap-1 group">
               <div className="p-1 rounded-xl transition-all">
                  <Home className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
               </div>
               <span className="text-[10px] font-bold text-blue-400">Home</span>
            </Link>
            <Link href="/history" className="flex flex-col items-center gap-1 group">
               <div className="p-1 rounded-xl transition-all">
                  <History className="w-6 h-6 text-white/20 group-hover:text-white" />
               </div>
               <span className="text-[10px] font-bold text-white/20 group-hover:text-white">History</span>
            </Link>
            <div className="flex flex-col items-center gap-1 group opacity-40">
               <div className="p-1 rounded-xl transition-all">
                  <Crown className="w-6 h-6 text-white/20" />
               </div>
               <span className="text-[10px] font-bold text-white/20">{credits} Credits</span>
            </div>
         </div>

      </main>
    </div>
  )
}
