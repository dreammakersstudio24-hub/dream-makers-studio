import { createServerSupabaseClient, createAdminClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { approveGalleryItem, rejectGalleryItem } from '@/actions/admin';
import { CheckCircle2, XCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard - Studio AI',
};

const ADMIN_EMAILS = ['dreammakersstudio24@gmail.com'];

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || (!ADMIN_EMAILS.includes(user.email ?? '') && user.email !== 'dreammakersstudio24@gmail.com')) {
    redirect('/app/dashboard');
  }

  // Fetch pending gallery items (is_approved = false) using Admin Client to bypass RLS
  const supabaseAdmin = createAdminClient();
  const { data: pendingItems, error } = await supabaseAdmin
    .from('gallery_items')
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching admin items:", error);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-32">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-6 h-16 flex items-center shadow-sm">
        <h1 className="font-bold text-lg tracking-tight">Admin Approval Queue</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8">
        <p className="text-neutral-500 mb-8">
          Welcome back. Review the AI-generated images below. Approved images will instantly appear in the public Pinterest-style Gallery.
        </p>

        {(!pendingItems || pendingItems.length === 0) ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200 shadow-sm">
            <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-neutral-800">Queue Emty</h2>
            <p className="text-neutral-500 mt-2">No AI images are currently waiting for approval.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-auto bg-neutral-100 relative">
                   {item.after_image_url ? (
                       <img src={item.after_image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                   )}
                </div>

                {/* Info & Actions Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                   <div>
                       <div className="flex items-center gap-2 mb-2">
                           <span className="bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">{item.style_category}</span>
                           <span className="bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">✨ AI</span>
                       </div>
                       <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                       <p className="text-neutral-600 font-light text-sm mb-6">{item.description}</p>
                   </div>

                   <form action={approveGalleryItem.bind(null, item.id)} className="space-y-4">
                       <div>
                           <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Keywords (Comma separated)</label>
                           <input 
                              type="text" 
                              name="keywords" 
                              defaultValue={item.keywords?.join(', ')} 
                              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. Modern, Minimalist, Living Room"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                               Affiliate Link <ExternalLink className="w-3 h-3" />
                           </label>
                           <input 
                              type="url" 
                              name="affiliateUrl" 
                              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://temu.com/..."
                           />
                       </div>

                       <div className="flex gap-3 pt-4">
                           <button 
                              type="submit" 
                              className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                           >
                              <CheckCircle2 className="w-5 h-5" /> Approve & Publish
                           </button>
                           
                           <button 
                              type="submit" 
                              formAction={rejectGalleryItem.bind(null, item.id, item.after_image_url)}
                              className="px-6 bg-red-50 text-red-600 py-4 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-red-100 transition-colors"
                           >
                              <XCircle className="w-5 h-5" /> Reject
                           </button>
                       </div>
                   </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
