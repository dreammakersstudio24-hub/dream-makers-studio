import { createServerSupabaseClient } from "@/utils/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch some stats
  const { count: galleryCount } = await supabase.from('gallery_items').select('*', { count: 'exact', head: true });
  const { count: customerCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });

  return (
    <div>
      <h1 className="text-3xl font-light mb-8 tracking-wide">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-neutral-900 border border-white/10 rounded-3xl">
          <h3 className="text-neutral-400 text-sm font-medium tracking-widest uppercase mb-2">Gallery Items</h3>
          <p className="text-4xl font-light text-white">{galleryCount || 0}</p>
        </div>
        
        <div className="p-6 bg-neutral-900 border border-white/10 rounded-3xl">
          <h3 className="text-neutral-400 text-sm font-medium tracking-widest uppercase mb-2">Total Sales</h3>
          <p className="text-4xl font-light text-white">{customerCount || 0}</p>
        </div>

        <div className="p-6 bg-gradient-to-tr from-green-500/20 to-transparent border border-green-500/20 rounded-3xl flex flex-col justify-center">
          <h3 className="text-green-500 text-sm font-medium tracking-widest uppercase mb-2">System Status</h3>
          <p className="text-2xl font-light text-white flex items-center gap-2">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span> All Systems Operational
          </p>
        </div>
      </div>
    </div>
  )
}
