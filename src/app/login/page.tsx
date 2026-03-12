import { login } from '@/actions/auth'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center p-6 selection:bg-blue-100">
      <div className="w-full max-w-md pt-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light mb-2 tracking-wide text-neutral-900">Admin Portal</h1>
          <p className="text-neutral-500 font-light">Sign in to manage your gallery and content.</p>
        </div>

        <div className="bg-white border border-neutral-200 shadow-sm rounded-3xl p-8">
          <form className="space-y-6" action={login}>
            {searchParams?.error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 font-medium text-sm rounded-xl text-center">
                Invalid email or password.
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold tracking-wide text-neutral-700" htmlFor="email">Email</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                placeholder="admin@dreammakersstudio.xyz"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold tracking-wide text-neutral-700" htmlFor="password">Password</label>
              <input 
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-900 text-white py-4 rounded-xl text-sm tracking-widest font-bold hover:bg-blue-800 transition-colors mt-2 shadow-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
