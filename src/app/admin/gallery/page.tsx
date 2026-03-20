import { createServerSupabaseClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Plus, Trash2, Loader2 } from "lucide-react"

export default async function AdminGalleryListPage() {
  const supabase = await createServerSupabaseClient()
  const { data: items } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase line-clamp-1">Visual Archive</h1>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">Gallery Asset Management</p>
        </div>
        <Link href="/admin/gallery/new" className="bg-white text-black px-8 py-4 flex items-center justify-center gap-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-xl shadow-white/5 active:scale-95">
          <Plus className="w-4 h-4" /> Add New Vision
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 text-white/30">
              <tr>
                <th className="px-8 py-6 font-black tracking-[0.3em] uppercase text-[9px]">Visual</th>
                <th className="px-8 py-6 font-black tracking-[0.3em] uppercase text-[9px]">Manifestation</th>
                <th className="px-8 py-6 font-black tracking-[0.3em] uppercase text-[9px]">Classification</th>
                <th className="px-8 py-6 font-black tracking-[0.3em] uppercase text-[9px]">Metadata</th>
                <th className="px-8 py-6 font-black tracking-[0.3em] uppercase text-[9px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items?.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg">
                       <img src={item.after_image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black uppercase tracking-tight text-sm line-clamp-1">{item.title}</span>
                      <span className="text-[10px] text-white/20 font-medium line-clamp-1 italic uppercase">{item.id.substring(0, 8)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-white/5 px-4 py-2 text-[9px] font-black tracking-[0.2em] uppercase rounded-full border border-white/10 text-white/60">{item.style_category}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {item.is_ai_generated ? (
                          <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1">
                            <Plus className="w-3 h-3 rotate-45" /> AI Rendered
                          </span>
                        ) : (
                          <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Manual Archive
                          </span>
                        )}
                      </div>
                      {item.keywords && item.keywords.length > 0 && (
                        <div className="flex gap-1 overflow-hidden">
                          {item.keywords.slice(0, 2).map((kw: string) => (
                            <span key={kw} className="text-[8px] text-white/30 font-black uppercase tracking-tighter">#{kw}</span>
                          ))}
                          {item.keywords.length > 2 && <span className="text-[8px] text-white/10 font-black">+{item.keywords.length - 2}</span>}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <form action={async () => {
                      "use server";
                      const { deleteGalleryItem: deleteItem } = await import("@/actions/gallery");
                      await deleteItem(item.id);
                    }}>
                      <button type="submit" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/0 hover:border-red-500/30 hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all flex items-center justify-center group/btn shadow-inner">
                        <Trash2 className="w-5 h-5 transition-transform group-active/btn:scale-90" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="inline-flex flex-col items-center">
                       <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 text-white/10 border border-white/10 shadow-inner">
                         <Loader2 className="w-10 h-10 animate-pulse" />
                       </div>
                       <span className="text-white/40 font-black text-xl tracking-tighter uppercase mb-2">Archive Vacant</span>
                       <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Initialize your first visual manifestation.</span>
                    </div>
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
