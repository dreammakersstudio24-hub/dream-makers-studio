import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Crown, Armchair, Flame, Home, LogOut, History } from 'lucide-react'
import { logout } from '@/actions/auth'
import { PwaInstallBanner } from '@/components/PwaInstallBanner'
import { BuyCreditsButton } from '@/components/BuyCreditsButton'

export const metadata = {
  title: 'Dashboard - Dream Makers Studio AI',
}

export default async function MobileDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/app')
  }

  const { data: userMeta } = await supabase
    .from('users_metadata')
    .select('credits')
    .eq('id', session.user.id)
    .single()

  const credits = userMeta?.credits || 0

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 pb-32 font-sans overflow-x-hidden">

      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">

        {/* Title Section */}
        <header className="relative text-center space-y-2">
          {/* Logout button */}
          <div className="absolute right-0 top-0">
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all active:scale-95 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wide">Logout</span>
              </button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-400/30 flex items-center justify-center border border-yellow-400/60">
              <Sparkles className="w-3 h-3 text-yellow-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-neutral-500">Dream Makers Studio AI</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 leading-none">
            Transform <span className="text-neutral-400 font-medium">Your Space</span>
          </h1>
        </header>

        {/* PWA Install Banner */}
        <PwaInstallBanner />

        {/* Buy Credits Banner — shown only when credits = 0 */}
        {credits === 0 && (
          <div className="space-y-1">
            <BuyCreditsButton variant="banner" />
            <p className="text-center text-[10px] text-neutral-400">🔒 40 designs · $20 one-time · Secure via Stripe</p>
          </div>
        )}

        {/* 2-Column Grid */}
        <section className="grid grid-cols-2 gap-4">

          {/* Interior */}
          <Link
            href="/app/generate"
            className="group relative aspect-[0.75/1] rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 hover:scale-[1.03] active:scale-95 bg-neutral-200 border border-neutral-200"
          >
            <img
              src="/dashboard-interior.png"
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[3000ms]"
              alt="Interior"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-110 transition-all">
                <Armchair className="w-7 h-7 text-white drop-shadow" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-center z-20 space-y-0.5">
              <h3 className="text-sm font-black text-white tracking-tight leading-none">Interior <span className="text-white/60 italic font-medium">Redesign</span></h3>
              <p className="text-[8px] text-white/70 font-medium leading-tight">Personalized living spaces</p>
            </div>
          </Link>

          {/* Garden */}
          <Link
            href="/app/garden"
            className="group relative aspect-[0.75/1] rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 hover:scale-[1.03] active:scale-95 bg-neutral-200 border border-neutral-200"
          >
            <img
              src="/dashboard-garden.png"
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[3000ms]"
              alt="Garden"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-110 transition-all">
                <Flame className="w-7 h-7 text-orange-300 drop-shadow" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-center z-20 space-y-0.5">
              <h3 className="text-sm font-black text-white tracking-tight leading-none">Garden <span className="text-white/60 italic font-medium">&amp; Outdoor</span></h3>
              <p className="text-[8px] text-white/70 font-medium leading-tight">Dream patios &amp; gardens</p>
            </div>
          </Link>

        </section>

        {/* Bottom Nav */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[88%] max-w-sm bg-white/90 backdrop-blur-2xl border border-neutral-200 shadow-xl rounded-[2rem] px-8 py-4 flex items-center justify-between z-[100]">
          <Link href="/app/dashboard" className="flex flex-col items-center gap-1 group">
            <div className="p-1 rounded-xl">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-blue-600">Home</span>
          </Link>
          <Link href="/history" className="flex flex-col items-center gap-1 group">
            <div className="p-1 rounded-xl">
              <History className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-neutral-400 group-hover:text-neutral-700 transition-colors">History</span>
          </Link>
          <div className="flex flex-col items-center gap-1">
            <div className="p-1 rounded-xl">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-[10px] font-bold text-amber-600">{credits} Credits</span>
          </div>
          <BuyCreditsButton variant="nav" />
        </div>

      </main>
    </div>
  )
}
