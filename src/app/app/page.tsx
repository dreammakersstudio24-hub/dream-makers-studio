import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Home, TreePine, Zap, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react'

export const metadata = {
  title: 'Studio AI - Dream Makers Studio',
  description: 'Transform your space with AI interior and garden design.',
}

export default async function AppSalesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans overflow-x-hidden">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <div className="max-w-2xl mx-auto space-y-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            <Sparkles className="w-3 h-3 text-amber-500" /> Dream Makers Studio AI
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-neutral-900">
            Transform<br />
            <span className="text-neutral-400 font-medium">Your Space</span>
          </h1>

          <p className="text-neutral-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            AI-powered interior and garden design. Upload a photo, choose a style, and see your dream space in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login?mode=signup&next=/app/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?next=/app/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-neutral-200 text-neutral-700 rounded-2xl text-sm font-bold hover:bg-neutral-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-900">Interior Design</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Redesign any room — living room, bedroom, kitchen — in seconds.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
              <TreePine className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-900">Garden Design</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Turn your outdoor space into a beautiful garden or patio.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-900">Fast Results</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              High-quality AI transformation in under 30 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-neutral-100 py-20">
        <div className="max-w-xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center gap-10 text-neutral-400 mb-4">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-7 h-7" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CreditCard className="w-7 h-7" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Pay per use</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Ready to transform your home?
          </h2>

          <Link
            href="/login?mode=signup&next=/app/dashboard"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 rounded-2xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-xl active:scale-95"
          >
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs text-neutral-400 mt-4">
            Dream Makers Studio © 2026
          </p>
        </div>
      </section>
    </div>
  )
}
