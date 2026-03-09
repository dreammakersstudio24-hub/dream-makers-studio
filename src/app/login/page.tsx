import { login } from '@/actions/auth'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-white/30">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-widest uppercase">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-light mb-2 tracking-wide">Admin Portal</h1>
          <p className="text-neutral-500 font-light">Sign in to manage your gallery and content.</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
          <form className="space-y-6" action={login}>
            {searchParams?.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
                Invalid email or password.
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium tracking-wide text-neutral-300" htmlFor="email">Email</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="admin@dreammakersstudio.xyz"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium tracking-wide text-neutral-300" htmlFor="password">Password</label>
              <input 
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-white text-black py-4 rounded-xl text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
