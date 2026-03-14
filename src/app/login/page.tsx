"use client"

import { login, signup } from '@/actions/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; mode?: string; next?: string; message?: string }
}) {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(searchParams?.mode === 'signup')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(searchParams?.message || (searchParams?.error ? "Invalid email or password." : ""))
  const nextUrl = searchParams?.next || '/ai-redesign'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = isSignUp ? await signup(formData) : await login(formData)
      if (result?.error) {
        setErrorMessage(result.error)
        setIsLoading(false)
      } else {
        // Success - force client navigation
        router.push(nextUrl)
        router.refresh()
      }
    } catch (err: any) {
      if (err.message === "NEXT_REDIRECT") {
          // This is actually a success state in Next.js server actions
          router.push(nextUrl)
          router.refresh()
      } else {
          setErrorMessage("An unexpected error occurred.")
          setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center p-6 selection:bg-blue-100 font-sans">
      <div className="w-full max-w-md pt-12 text-center mb-8">
         <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
           <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
           </svg>
         </div>
         <h1 className="text-3xl font-light mb-2 tracking-tight text-neutral-900">
           {isSignUp ? "Create an Account" : "Welcome to the Studio"}
         </h1>
         <p className="text-neutral-500 font-light text-sm">
           {isSignUp ? "Sign up to start transforming spaces with AI." : "Log in to continue designing."}
         </p>
      </div>

      <div className="w-full max-w-md bg-white border border-neutral-200 shadow-xl rounded-[2rem] overflow-hidden">
        {/* Form Body */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="next" value={nextUrl} />
            
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 font-medium text-sm rounded-xl text-center">
                {errorMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-neutral-500 uppercase" htmlFor="email">Email Address</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium disabled:opacity-50"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-neutral-500 uppercase" htmlFor="password">Password</label>
              <input 
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium disabled:opacity-50"
                placeholder="••••••••"
                disabled={isLoading}
                minLength={6}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-xl text-sm tracking-widest font-bold hover:bg-neutral-800 hover:scale-[1.02] transition-all shadow-md uppercase mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Authenticating..." : (isSignUp ? "Create My Account" : "Access Studio")}
            </button>
          </form>

          {/* Toggle Mode Link */}
          <div className="mt-6 text-center text-sm text-neutral-500">
            {isSignUp ? (
                <p>Already have an account? <button type="button" onClick={() => {setIsSignUp(false); setErrorMessage("");}} className="text-black font-bold hover:underline">Log in</button></p>
            ) : (
                <p>Don't have an account? <button type="button" onClick={() => {setIsSignUp(true); setErrorMessage("");}} className="text-black font-bold hover:underline">Sign up</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
