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
      {/* Premium Launcher Body */}
      <main className="px-6 pt-16 space-y-10 max-w-lg mx-auto">
         
         {/* Title Section */}
         <header className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 leading-none">
               Transform <br/> 
               <span className="text-neutral-400 font-medium">Your Space</span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.4em]">AI Selection Center</p>
         </header>

         {/* Credit Status (Glassmorphism Capsule) */}
         <div className="mx-auto flex items-center justify-between border border-neutral-200 bg-white shadow-xl rounded-[2rem] px-6 py-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none mb-1">Total Balance</p>
                  <p className="text-lg font-black text-neutral-900 leading-none">{credits} <span className="text-[10px] text-neutral-400 font-bold">Credits</span></p>
               </div>
            </div>
            {!hasCredits && (
               <button className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg">Top Up</button>
            )}
         </div>

         {/* 2-Column Grid Transformation Choices */}
         <section className="grid grid-cols-2 gap-4">
            
            {/* Interior Transformation Card */}
            <Link 
               href="/app/generate"
               className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 bg-neutral-950 border border-white/10"
            >
               <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41fa33a8?q=80&w=400&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3000ms]" 
                  alt="Interior"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
               
               {/* Glowing Center Icon */}
               <div className="absolute inset-0 flex items-center justify-center z-20">
                   <div className="w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
                       <ImageIcon className="w-7 h-7 text-blue-300" />
                   </div>
               </div>

               {/* Bottom Content */}
               <div className="absolute inset-x-0 bottom-0 p-6 text-center z-20">
                  <h3 className="text-lg font-black text-white tracking-tight mb-1">Interior <span className="text-white/40 italic">Redesign</span></h3>
                  <p className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-relaxed">Create stunning, personalized living spaces</p>
               </div>
            </Link>

            {/* Garden & Exterior Card */}
            <Link 
               href="/app/garden"
               className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 bg-emerald-950 border border-white/10"
            >
               <img 
                  src="https://images.unsplash.com/photo-1558904541-efa8c1ae65f4?q=80&w=400&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3000ms]" 
                  alt="Garden"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-emerald-950/40 to-transparent z-10" />
               
               {/* Glowing Center Icon */}
               <div className="absolute inset-0 flex items-center justify-center z-20">
                   <div className="w-16 h-16 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform">
                       <Sparkles className="w-7 h-7 text-orange-300" />
                   </div>
               </div>

               {/* Bottom Content */}
               <div className="absolute inset-x-0 bottom-0 p-6 text-center z-20">
                  <h3 className="text-lg font-black text-white tracking-tight mb-1">Garden <span className="text-white/40 italic">& Outdoor</span></h3>
                  <p className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-relaxed">Design dream patios, gardens & outdoor retreats</p>
               </div>
            </Link>

         </section>

         {/* "Popular Tools" Minimalist List */}
         <div className="space-y-4 pt-4">
            <h2 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] text-center">Popular Tools</h2>
            <div className="flex justify-center gap-3">
                <Link href="/history" className="bg-white border border-neutral-100 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <History className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-bold text-neutral-800 tracking-tight">Project History</span>
                </Link>
                <Link href="/shop" className="bg-white border border-neutral-100 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <Download className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-bold text-neutral-800 tracking-tight">Style Inspiration</span>
                </Link>
            </div>
         </div>

         {/* Floating Bottom Nav */}
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-fit bg-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-full px-8 py-4 flex items-center gap-10 z-[100]">
            <Link href="/app/dashboard" className="flex flex-col items-center gap-1 group">
               <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white group-hover:text-black transition-all">
                  <ImageIcon className="w-5 h-5 text-white group-hover:text-black" />
               </div>
               <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Home</span>
            </Link>
            <Link href="/history" className="flex flex-col items-center gap-1 group">
               <div className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <History className="w-5 h-5 text-white/40 group-hover:text-white" />
               </div>
               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">History</span>
            </Link>
            <Link href="/shop" className="flex flex-col items-center gap-1 group">
               <div className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <Download className="w-5 h-5 text-white/40 group-hover:text-white" />
               </div>
               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Credits</span>
            </Link>
         </div>

      </main>
    </div>
  )
}
