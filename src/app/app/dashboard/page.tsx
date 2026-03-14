import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, History, ImageIcon, Download, Settings, Crown } from 'lucide-react'
import { logout } from '@/actions/auth'
import { TestCreditButton } from '@/components/TestCreditButton'
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

      <main className="px-6 pt-8 space-y-8 max-w-lg mx-auto">
         
         {/* Credit Status Card */}
         <div className={`p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden ${hasCredits ? 'bg-black' : 'bg-red-600'}`}>
             <div className="absolute -right-10 -top-10 opacity-10">
                 <Crown className="w-48 h-48" />
             </div>
             <p className="text-white/70 font-medium text-sm mb-1 uppercase tracking-wider relative z-10">Current Balance</p>
             <div className="flex items-baseline gap-2 mb-6 relative z-10">
                 <span className="text-6xl font-light tracking-tighter">{credits}</span>
                 <span className="text-lg font-medium text-white/50">Credits</span>
             </div>
             
             {!hasCredits && (
                 <p className="text-white/80 text-sm mb-6 relative z-10">
                     You need credits to generate beautiful interior designs.
                 </p>
             )}

             {/* Primary Action Button (Dynamic based on credits) */}
             <div className="relative z-10">
                 {hasCredits ? (
                     <Link 
                        href="/app/generate"
                        className="w-full bg-white text-black py-4 rounded-2xl font-bold text-center block shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-lg"
                     >
                        Generate New Design
                     </Link>
                 ) : (
                     <button 
                        className="w-full bg-white text-red-600 py-4 rounded-2xl font-bold text-center block shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-lg"
                     >
                        Recharge Credits ($10)
                     </button>
                 )}
                 <TestCreditButton />
             </div>
         </div>

         {/* Navigation Menu Grid */}
         <div>
            <h2 className="text-lg font-bold mb-4 tracking-tight">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
                <Link 
                    href="/history"
                    className="aspect-square bg-white border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-900">My Projects</h3>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">View saved redesigns</p>
                    </div>
                </Link>

                <Link 
                    href="/history"
                    className="aspect-square bg-white border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Download className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-900">Downloads</h3>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">Export histories</p>
                    </div>
                </Link>
            </div>
         </div>

      </main>
    </div>
  )
}
