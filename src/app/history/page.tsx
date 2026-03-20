import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Sparkles, Image as ImageIcon, ArrowRight } from 'lucide-react'
import { logout } from '@/actions/auth'

export const metadata = {
  title: 'My Designs - Dream Makers Studio',
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
    <div className="min-h-screen bg-[#020203] text-white selection:bg-white/10">
      <main className="max-w-7xl mx-auto pt-32 pb-32 px-4 sm:px-6 min-h-screen">
        <div className="flex items-center gap-6 mb-16">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-3xl">
                <ImageIcon className="w-8 h-8 text-white/20" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Your Archive</h1>
                <p className="text-white/30 font-black uppercase tracking-[0.3em] mt-2 text-[10px]">Elite Transformations History</p>
            </div>
        </div>

        {!generations || generations.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl">
                <Sparkles className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">The Archive is Empty</h3>
                <p className="text-white/30 mb-10 font-medium tracking-tight uppercase text-xs">Initiate your first architectural vision in the studio.</p>
                <Link 
                    href="/app/dashboard"
                    className="bg-white text-black px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all shadow-xl"
                >
                    Enter Studio
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {generations.map((gen: any) => (
                    <div key={gen.id} className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col group transition-all duration-500 hover:border-white/20 hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                        <div className="relative aspect-[4/5] overflow-hidden bg-black">
                            <img 
                                src={gen.generated_image_url} 
                                alt={`Generated ${gen.room_type} in ${gen.style}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <span className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 text-white shadow-2xl w-fit">
                                    {gen.room_type}
                                </span>
                                <span className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 text-white shadow-2xl w-fit">
                                    {gen.style}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-8 flex justify-between items-center bg-[#0a0a0b] border-t border-white/5">
                            <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
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
                                className="text-[10px] font-black text-white hover:text-white/70 transition-all uppercase tracking-[0.3em] flex items-center gap-2"
                            >
                                Acquire <ArrowRight className="w-3 h-3" />
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
