import { createServerSupabaseClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function ContractorRegisterRedirect({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if they are already an active contractor
  const { data: contractor } = await supabase
     .from('contractors')
     .select('*')
     .eq('user_id', user.id)
     .single()

  // If they have an active subscription but no profile data, show the onboarding form
  // Otherwise, send them to the directory or dashboard
  if (contractor?.is_active && (!contractor.company_name || !contractor.country)) {
     // NOTE: We could build the onboarding form here, but for brevity we'll redirect to their dashboard
     redirect('/contractors/dashboard')
  } else if (contractor?.is_active) {
     redirect('/contractors/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
       <div className="text-center max-w-lg">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">⏳</div>
          <h1 className="text-2xl font-light mb-4 tracking-wide">Verifying Subscription...</h1>
          <p className="text-neutral-500 font-light leading-relaxed mb-8">
             We are currently processing your payment with Stripe. It may take a few moments for your subscription to activate. Please refresh this page if it doesn't automatically redirect.
          </p>
          <a href="/contractors/dashboard" className="px-6 py-3 border border-white/20 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
            Check Status
          </a>
       </div>
    </div>
  )
}
