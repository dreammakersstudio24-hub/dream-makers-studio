import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react'

export default async function AdminContractorsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all contractors
  const { data: contractors } = await supabase
    .from('contractors')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-light mb-2 tracking-wide">Contractors Directory</h1>
          <p className="text-neutral-500 font-light">Manage your professional network subscriptions.</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs tracking-widest text-neutral-500 uppercase bg-black/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contractors?.map((contractor) => (
                <tr key={contractor.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium">{contractor.company_name || 'Incomplete Profile'}</div>
                    <div className="text-xs text-neutral-500">ID: {contractor.id.split('-')[0]}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-400">{contractor.city || '-'}, {contractor.country || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-300">{contractor.contact_email}</div>
                    <div className="text-neutral-500">{contractor.phone_number}</div>
                  </td>
                  <td className="px-6 py-4">
                     {contractor.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                           <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                     ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                           <XCircle className="w-3.5 h-3.5" /> {contractor.subscription_status || 'Inactive'}
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                      {contractor.stripe_customer_id && (
                        <a 
                          href={`https://dashboard.stripe.com/customers/${contractor.stripe_customer_id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-neutral-500 hover:text-white p-2 rounded-xl transition-colors inline-flex opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="View on Stripe"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                  </td>
                </tr>
              ))}

              {(!contractors || contractors.length === 0) && (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 font-light">
                       No contractors joined yet. Provide the /contractors/join link to recruit professionals.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
