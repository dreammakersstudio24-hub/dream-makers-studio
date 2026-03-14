import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Sparkles, Image as ImageIcon } from 'lucide-react'
import { logout } from '@/actions/auth'

export const metadata = {
  title: 'My Designs - Dream Makers',
}

export default async function HistoryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Filter for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();

  const { data: generations, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgoIso)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 font-sans">
      <nav className="fixed w-full z-40 top-0 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/app/dashboard"
            className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
          >
             <ChevronLeft className="w-5 h-5" />
             <span className="font-medium hidden sm:block">Dashboard</span>
          </Link>
          
          <span className="text-lg font-medium tracking-wide">
            My Designs
          </span>
          
          <div className="flex items-center gap-6">
            <form action={logout}>
              <button 
                type="submit"
                className="text-sm font-medium hover:text-white text-neutral-400 transition-colors"
               >
                 Log Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-24 pb-32 px-4 sm:px-6 min-h-screen">
        <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <ImageIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
                <h1 className="text-3xl font-light">Design History</h1>
                <p className="text-neutral-400 font-light mt-1 text-sm">Your past transformations</p>
            </div>
        </div>

        {!generations || generations.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10">
                <Sparkles className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No designs yet</h3>
                <p className="text-neutral-400 mb-8 font-light">Start your first room transformation in the studio.</p>
                <Link 
                    href="/app/generate"
                    className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors"
                >
                    Create Design
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {generations.map((gen: any) => (
                    <div key={gen.id} className="bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 flex flex-col group">
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <img 
                                src={gen.generated_image_url} 
                                alt={`Generated ${gen.room_type} in ${gen.style}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-black"
                            />
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-widest border border-white/10 text-white shadow-lg w-fit">
                                    {gen.room_type}
                                </span>
                                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-widest border border-white/10 text-white shadow-lg w-fit">
                                    {gen.style}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-neutral-900 flex justify-between items-center border-t border-white/5">
                            <div className="text-xs text-neutral-500 font-medium tracking-wide">
                                {new Date(gen.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                            <a 
                                href={gen.generated_image_url} 
                                download={`design-${gen.id}.jpg`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-white hover:text-neutral-300 transition-colors uppercase tracking-widest flex items-center gap-1"
                            >
                                Download
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
