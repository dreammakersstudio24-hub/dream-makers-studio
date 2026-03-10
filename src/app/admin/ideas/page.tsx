import { createServerSupabaseClient } from "@/utils/supabase/server"
import { addGenerationIdea, toggleIdeaStatus, deleteGenerationIdea } from "@/actions/ideas"
import { Plus, Trash2, Power } from "lucide-react"

export default async function AdminIdeasPage() {
  const supabase = await createServerSupabaseClient()
  const { data: ideas } = await supabase.from('generation_ideas').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-light tracking-wide">AI Generation Ideas</h1>
           <p className="text-neutral-500 mt-2 text-sm">Manage the prompts used by the automated cron job to generate new gallery images.</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 mb-8">
         <h2 className="text-lg font-medium mb-4">Add New Idea</h2>
         <form action={addGenerationIdea} className="flex gap-4">
            <input 
               type="text" 
               name="prompt_idea" 
               placeholder="e.g. Modern minimalist living room with large windows and neutral colors..."
               className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-600"
               required
            />
            <button type="submit" className="bg-white text-black px-6 py-3 flex items-center gap-2 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors">
               <Plus className="w-4 h-4" /> Add Idea
            </button>
         </form>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-neutral-400">
            <tr>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs w-[60%]">Prompt Idea</th>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs">Status</th>
              <th className="px-6 py-5 font-medium tracking-widest uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {ideas?.map(idea => (
              <tr key={idea.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-white">{idea.prompt_idea}</td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1.5 text-xs tracking-widest uppercase rounded-full ${idea.is_active ? 'bg-green-500/10 text-green-400' : 'bg-neutral-500/10 text-neutral-400'}`}>
                      {idea.is_active ? 'Active' : 'Inactive'}
                   </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <form action={toggleIdeaStatus.bind(null, idea.id, idea.is_active ?? false)}>
                        <button className="text-neutral-500 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all" title="Toggle active status">
                        <Power className="w-4 h-4" />
                        </button>
                     </form>
                     <form action={deleteGenerationIdea.bind(null, idea.id)}>
                        <button className="text-neutral-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all" title="Delete idea">
                        <Trash2 className="w-4 h-4" />
                        </button>
                     </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!ideas || ideas.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center">
                  <div className="inline-flex flex-col items-center">
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-neutral-500">✨</div>
                     <span className="text-neutral-400 font-light text-lg">No ideas found.</span>
                     <span className="text-neutral-600 text-sm mt-1">Add your first prompt idea above for the AI to start generating.</span>
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
