import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Camera, Palette, Zap, Home, TreePine } from 'lucide-react'
import { CompareSlider } from '@/components/CompareSlider'

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
            Get Started · from $10 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/login?next=/app/dashboard"
            className="flex-1 flex items-center justify-center bg-white border border-neutral-200 text-neutral-700 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-50 active:scale-95 transition-all"
          >
            Log In
          </Link>
        </div>

        {/* Price + Trust hint */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-600 mb-8">
          <span>🔒</span>
          <span>One-time payment · Secure via <span className="font-black text-neutral-800">Stripe</span></span>
        </div>
        {/* Interactive Before/After Garden Slider */}
        <div className="w-full max-w-xs">
          <CompareSlider
            originalImage="/garden-before.jpg"
            resultImage="/garden-after.jpg"
            aspectRatio="aspect-[9/16]"
            objectFit="cover"
          />
          <p className="text-center text-[10px] text-neutral-400 -mt-4 mb-2">
            👆 Drag to compare before &amp; after
          </p>
        </div>

      </section>

      {/* ── HOW IT WORKS ──────────────────────── */}
      <section className="px-5 py-5 max-w-sm mx-auto">
        <h2 className="text-center text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">How it works</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Camera, label: 'Upload a photo', color: 'bg-blue-50 text-blue-600', step: '1' },
            { icon: Palette, label: 'Choose your style', color: 'bg-purple-50 text-purple-600', step: '2' },
            { icon: Zap, label: 'See results in 30 sec', color: 'bg-amber-50 text-amber-600', step: '3' },
          ].map(({ icon: Icon, label, color, step }) => (
            <div key={step} className="flex flex-col items-center gap-2 text-center">
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-neutral-700 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORKS FOR ─────────────────────────── */}
      <section className="px-5 pb-10 max-w-sm mx-auto space-y-5">
        <h2 className="text-center text-xs font-black uppercase tracking-widest text-neutral-400">What you can redesign</h2>

        {/* Interior Card */}
        <div className="rounded-3xl overflow-hidden shadow-md bg-neutral-100">
          <div className="relative aspect-[16/9] bg-neutral-200">
            <img src="/dashboard-interior.png" alt="Interior redesign" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-black text-sm leading-tight">Interior Redesign</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Rooms</p>
              <div className="flex flex-wrap gap-1.5">
                {['Living Room','Bedroom','Kitchen','Bathroom','Home Office','Dining Room','Kids Room'].map(r => (
                  <span key={r} className="bg-neutral-100 border border-neutral-200 text-neutral-600 text-[9px] font-bold px-2 py-1 rounded-full">{r}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Styles (10+)</p>
              <div className="flex flex-wrap gap-1.5">
                {['Modern','Scandinavian','Bohemian','Industrial','Japandi','Mid-Century','Luxury','Minimalist','Classic','Cozy'].map(s => (
                  <span key={s} className="bg-neutral-100 border border-neutral-200 text-neutral-600 text-[9px] font-bold px-2 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">Upload any room photo → pick a style → get a professional redesign in 15–30 seconds. Download and share instantly.</p>
          </div>
        </div>

        {/* Garden Card */}
        <div className="rounded-3xl overflow-hidden shadow-md bg-neutral-100">
          <div className="relative aspect-[16/9] bg-neutral-200">
            <img src="/dashboard-garden.png" alt="Garden redesign" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <TreePine className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-black text-sm leading-tight">Garden & Outdoor</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Spaces</p>
              <div className="flex flex-wrap gap-1.5">
                {['Backyard','Patio','Front Yard','Balcony','Pool Area','Rooftop','Side Garden'].map(r => (
                  <span key={r} className="bg-neutral-100 border border-neutral-200 text-neutral-600 text-[9px] font-bold px-2 py-1 rounded-full">{r}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Add-ons & Upgrades</p>
              <div className="flex flex-wrap gap-1.5">
                {['Fire Pit Lounge','Pergola','Outdoor Kitchen','Infinity Pool','Flower Garden','Water Feature','Lighting','Seating Area'].map(s => (
                  <span key={s} className="bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold px-2 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">Transform any outdoor space into your dream garden. Choose a style, add features like fire pits or pergolas, and see your vision come to life.</p>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────── */}
      <section className="px-5 pb-16 max-w-sm mx-auto space-y-4">
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-400">Choose Your Plan</p>

        {/* 2 Tier Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Starter */}
          <Link
            href="/login?mode=signup&next=/app/dashboard"
            className="relative bg-white border border-neutral-200 rounded-2xl p-4 text-left hover:bg-neutral-50 active:scale-95 transition-all shadow-sm"
          >
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Starter</p>
            <p className="text-2xl font-black text-neutral-900 leading-tight mt-0.5">$10</p>
            <p className="text-xs font-bold text-neutral-600 mt-1">15 Credits</p>
            <p className="text-[9px] text-neutral-400 mt-0.5">$0.67/design</p>
          </Link>

          {/* Best Value */}
          <Link
            href="/login?mode=signup&next=/app/dashboard"
            className="relative bg-amber-50 border border-amber-300 rounded-2xl p-4 text-left hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
              Best Value ⭐
            </span>
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mt-1">Value</p>
            <p className="text-2xl font-black text-neutral-900 leading-tight mt-0.5">$20</p>
            <p className="text-xs font-bold text-neutral-600 mt-1">40 Credits</p>
            <p className="text-[9px] text-neutral-400 mt-0.5">$0.50/design</p>
          </Link>
        </div>

        {/* Features */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-2">
          {[
            '✓ Interior room redesign (10+ styles)',
            '✓ Garden & outdoor transformation (8 styles)',
            '✓ Instant AI results — 15–30 seconds',
            '✓ Download & share your designs',
          ].map((item) => (
            <p key={item} className="text-xs text-neutral-600">{item}</p>
          ))}
        </div>

        <p className="text-center text-[10px] text-neutral-400">🔒 Secure one-time payment via Stripe</p>

        {/* Bottom CTA */}
        <div className="flex gap-3">
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
