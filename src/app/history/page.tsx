import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Sparkles, Image as ImageIcon, Download } from 'lucide-react'

export const metadata = {
  title: 'My Designs - Dream Makers Studio',
}

export default async function HistoryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans">
      <main className="max-w-2xl mx-auto pt-8 pb-32 px-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/app/dashboard" className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-200 rounded-2xl shadow-sm hover:bg-neutral-50 transition-all active:scale-95">
            <ChevronLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">My Designs</h1>
            <p className="text-xs text-neutral-500 font-medium">Last 30 days</p>
          </div>
        </div>

        {!generations || generations.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-neutral-100 shadow-sm">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-neutral-800">No designs yet</h3>
            <p className="text-neutral-500 mb-8 text-sm">Start your first AI transformation</p>
            <Link
              href="/app/dashboard"
              className="bg-black text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-md active:scale-95 inline-block"
            >
              Go to Studio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {generations.map((gen: any) => (
              <div key={gen.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={gen.generated_image_url}
                    alt={`${gen.room_type} — ${gen.style}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur rounded-full text-[8px] font-bold text-white w-fit">
                      {gen.room_type}
                    </span>
                    <span className="px-2 py-1 bg-white/80 backdrop-blur rounded-full text-[8px] font-bold text-neutral-700 w-fit">
                      {gen.style}
                    </span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {new Date(gen.created_at).toLocaleDateString('th-TH', {
                      month: 'short', day: 'numeric'
                    })}
                  </span>
                  <a
                    href={gen.generated_image_url}
                    download={`design-${gen.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Save
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
