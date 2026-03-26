import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Camera, Palette, Zap, Home, TreePine } from 'lucide-react'

export const metadata = {
  title: 'AI Studio — Dream Makers Studio',
  description: 'Transform your home and garden with AI. Upload a photo, choose a style, see results in 30 seconds.',
}

export default async function AppSalesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans overflow-x-hidden">

      {/* ── HERO ──────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-5 pt-28 pb-10 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 shadow-sm text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500 mb-6">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Dream Makers Studio AI
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-black tracking-tight leading-tight text-neutral-900 max-w-xs mx-auto mb-2">
          Transform Your{" "}
          <span className="text-neutral-400 font-medium">Home & Garden</span>
        </h1>

        <p className="text-neutral-500 text-xs max-w-xs mx-auto leading-relaxed mb-6">
          Upload a photo, pick a style — your AI-redesigned space appears in under 30 seconds.
        </p>

        {/* CTA Buttons — side by side */}
        <div className="flex w-full max-w-xs gap-3 mb-8">
          <Link
            href="/login?mode=signup&next=/app/dashboard"
            className="flex-1 flex items-center justify-center gap-1 bg-black text-white py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/login?next=/app/dashboard"
            className="flex-1 flex items-center justify-center bg-white border border-neutral-200 text-neutral-700 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-50 active:scale-95 transition-all"
          >
            Log In
          </Link>
        </div>

        {/* Before/After Preview Image */}
        <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border border-neutral-100">
          <img
            src="/dashboard-interior.png"
            alt="AI interior design transformation"
            className="w-full h-auto object-cover"
          />
        </div>

      </section>

      {/* ── HOW IT WORKS ──────────────────────── */}
      <section className="px-5 py-10 max-w-sm mx-auto">
        <h2 className="text-center text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">How it works</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Camera, label: 'Upload a photo', color: 'bg-blue-50 text-blue-600', step: '1' },
            { icon: Palette, label: 'Choose your style', color: 'bg-purple-50 text-purple-600', step: '2' },
            { icon: Zap, label: 'See results in 30 sec', color: 'bg-amber-50 text-amber-600', step: '3' },
          ].map(({ icon: Icon, label, color, step }) => (
            <div key={step} className="flex flex-col items-center gap-2 text-center">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-neutral-500 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORKS FOR ─────────────────────────── */}
      <section className="px-5 pb-10 max-w-sm mx-auto space-y-4">
        <h2 className="text-center text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">What you can redesign</h2>

        {/* Interior Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[16/9] bg-neutral-200">
          <img src="/dashboard-interior.png" alt="Interior redesign" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">Interior Redesign</p>
              <p className="text-white/60 text-[10px]">Living room, bedroom, kitchen & more</p>
            </div>
          </div>
        </div>

        {/* Garden Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[16/9] bg-neutral-200">
          <img src="/dashboard-garden.png" alt="Garden redesign" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <TreePine className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">Garden & Outdoor</p>
              <p className="text-white/60 text-[10px]">Patios, gardens, backyards & more</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────── */}
      <section className="px-5 pb-16 max-w-sm mx-auto">
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Simple Pricing</p>
          <div>
            <p className="text-5xl font-black text-neutral-900">$20</p>
            <p className="text-neutral-500 text-sm mt-1">40 Design Credits</p>
            <p className="text-neutral-400 text-xs mt-0.5">That's just $0.50 per transformation</p>
          </div>

          <div className="text-left space-y-2 pt-2">
            {[
              '✓ Interior room redesign (10+ styles)',
              '✓ Garden & outdoor transformation (8 styles)',
              '✓ Instant AI results — 15–30 seconds',
              '✓ Download & share your designs',
            ].map((item) => (
              <p key={item} className="text-xs text-neutral-600">{item}</p>
            ))}
          </div>

          <Link
            href="/login?mode=signup&next=/app/dashboard"
            className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl text-sm font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-lg"
          >
            Get Started · $20 <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-[10px] text-neutral-400">Secure payment via Stripe. One-time purchase.</p>

          {/* Bottom CTA — side by side */}
          <div className="flex gap-3 pt-1">
            <Link
              href="/login?mode=signup&next=/app/dashboard"
              className="flex-1 flex items-center justify-center gap-1 bg-black text-white py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/login?next=/app/dashboard"
              className="flex-1 flex items-center justify-center bg-white border border-neutral-200 text-neutral-700 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-50 active:scale-95 transition-all"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────── */}
      <footer className="border-t border-neutral-100 py-6 text-center">
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
          © 2026 Dream Makers Studio
        </p>
      </footer>

    </div>
  )
}
