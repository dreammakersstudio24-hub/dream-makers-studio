import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Home, TreePine, Zap, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react'

export const metadata = {
  title: 'Studio AI - Elite Transformation Engine',
  description: 'Experience the world\'s most advanced AI interior and garden design suite.',
}

export default async function AppSalesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  // If already logged in, skip the sales page
  if (session) {
    redirect('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-white/30 font-sans overflow-x-hidden">
      
      {/* Immersive Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 animate-fade-in">
                <Sparkles className="w-3 h-3 text-white" /> The Future of Architecture
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white uppercase sm:mb-8">
                Elite <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Synthesis</span>
            </h1>

            <p className="text-white/40 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
                Transform your reality with the Studio's proprietary AI engine. Professional-grade interior and landscape visualization in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <Link 
                  href="/login?mode=signup&next=/app/dashboard"
                  className="w-full sm:w-auto px-12 py-6 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 active:scale-95"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/login?next=/app/dashboard"
                  className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center active:scale-95"
                >
                    Log In
                </Link>
            </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden md:block">
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-6 py-40 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8">
            {/* Feature 1 */}
            <div className="group p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all">
                    <Home className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Interior Magic</h3>
                <p className="text-white/30 text-sm leading-relaxed font-medium uppercase tracking-tight">
                    Generate hyper-realistic interior designs from raw spaces. Instant styles, lighting, and textures for any room.
                </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all">
                    <TreePine className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Garden Vision</h3>
                <p className="text-white/30 text-sm leading-relaxed font-medium uppercase tracking-tight">
                    Visualize award-winning landscapes and garden sanctuaries. Perfect for private villas and luxury estates.
                </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all">
                    <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Rapid Render</h3>
                <p className="text-white/30 text-sm leading-relaxed font-medium uppercase tracking-tight">
                    No complex software needed. High-fidelity rendering in less than 60 seconds with our neural synth engine.
                </p>
            </div>
        </div>
      </section>

      {/* Trust & Acquisition Section */}
      <section className="bg-white/5 py-32">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
            <div className="flex justify-center gap-12 text-white/20 mb-12">
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-10 h-10" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Access</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-10 h-10" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Usage Credits</span>
                </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-tight">
                Acquire the instrument <br /> used by visionaries.
            </h2>
            
            <Link 
              href="/login?mode=signup&next=/app/dashboard"
              className="inline-flex items-center gap-4 bg-white text-black px-16 py-7 rounded-2xl text-sm font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
                Start Synthesizing Now
            </Link>
            
            <div className="pt-20 opacity-20 flex justify-center text-[10px] font-black uppercase tracking-[0.5em]">
                Dream Makers Studio © 2026 • Elite Edition
            </div>
        </div>
      </section>
    </div>
  )
}
