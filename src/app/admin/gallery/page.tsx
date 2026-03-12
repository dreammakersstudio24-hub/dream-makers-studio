import { createServerSupabaseClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"

export default async function AdminGalleryListPage() {
  const supabase = await createServerSupabaseClient()
  const { data: items } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light tracking-wide">Gallery Management</h1>
        <Link href="/admin/gallery/new" className="bg-white text-black px-4 py-2 flex items-center gap-2 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors">
          <Plus className="w-4 h-4" /> Add New Image
        </Link>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 border-b border-white/10 text-neutral-400">
            <tr>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs">Image</th>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs">Title</th>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs">Category</th>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs">Details</th>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items?.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/10">
                     <img src={item.after_image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                </td>
                <td className="px-6 py-4 text-white font-medium">{item.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-white/10 px-3 py-1.5 text-xs tracking-widest uppercase rounded-full">{item.style_category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {item.is_ai_generated && <span className="text-xs text-blue-400 font-medium tracking-wide">✨ AI Generated</span>}
                    {item.keywords && item.keywords.length > 0 && (
                      <span className="text-xs text-neutral-500">
                        {item.keywords.slice(0, 3).join(', ')}{item.keywords.length > 3 ? '...' : ''}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={async () => {
                    "use server";
                    const { deleteGalleryItem: deleteItem } = await import("@/actions/gallery");
                    await deleteItem(item.id);
                  }}>
                    <button type="submit" className="text-neutral-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all inline-flex opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!items || items.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="inline-flex flex-col items-center">
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-neutral-500">📸</div>
                     <span className="text-neutral-400 font-light text-lg">No images found.</span>
                     <span className="text-neutral-600 text-sm mt-1">Add your first image to showcase on the gallery.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
