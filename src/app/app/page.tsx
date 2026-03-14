import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Transformation App - Welcome',
  description: 'AI Interior Design mobile application.',
}

export default async function AppEntryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  // If already logged in, skip the entry page entirely
  if (session) {
    redirect('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-white/30 font-sans">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center flex-1 justify-center space-y-12">
        
        {/* Logo / Branding */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border border-white/10 mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-light tracking-tight">Transformation</h1>
          <p className="text-neutral-400 font-light text-lg">Your AI Interior Designer</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <Link 
            href="/login?mode=signup&next=/app/dashboard"
            className="w-full bg-white text-black py-5 rounded-2xl text-lg font-bold hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center active:scale-95"
          >
            Sign Up
          </Link>
          
          <Link 
            href="/login?next=/app/dashboard"
            className="w-full bg-neutral-900 border border-white/10 text-white py-5 rounded-2xl text-lg font-medium hover:bg-neutral-800 transition-all flex items-center justify-center active:scale-95"
          >
            Log In
          </Link>
        </div>
        
      </div>
    </div>
  )
}
