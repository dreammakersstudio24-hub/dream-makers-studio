import { createAdminClient, createServerSupabaseClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Package, Tag, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ['dreammakersstudio24@gmail.com'];

export default async function ShopAdminPage() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
      redirect('/app/dashboard');
    }

    const supabaseAdmin = createAdminClient();

    // Fetch Categories
    const { data: categories, error: catError } = await supabaseAdmin
      .from('product_categories')
      .select('*')
      .order('name');

    if (catError) throw catError;

    return (
      <div className="p-20 bg-neutral-50 min-h-screen text-neutral-900">
        <h1 className="text-4xl font-black mb-8 flex items-center gap-3">
          <Package className="w-10 h-10 text-blue-600" /> Shop Manager
        </h1>
        
        <div className="bg-white p-8 rounded-[40px] border border-neutral-200 shadow-xl max-w-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-neutral-400" /> Page Isolation Test: Level 2
          </h2>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            Authentication verified. Database connection stable. <br/>
            Found <strong>{categories?.length || 0}</strong> categories in system.
          </p>
          
          <div className="space-y-3">
            {categories?.map((cat: any) => (
              <div key={cat.id} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex justify-between items-center">
                <span className="font-bold">{cat.name}</span>
                <span className="text-xs text-neutral-400">/shop/{cat.slug}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex gap-4">
            <a href="/app/dashboard" className="px-8 py-4 bg-black text-white rounded-full font-bold">Back to Dashboard</a>
            <a href="/shop" target="_blank" className="px-8 py-4 bg-white border border-neutral-200 text-neutral-600 rounded-full font-bold">Public Shop</a>
        </div>
      </div>
    );
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err;
    return (
      <div className="min-h-screen flex items-center justify-center p-12 bg-neutral-900 text-white font-mono">
        <div className="max-w-2xl w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-red-500 mb-4">CRASH AT LEVEL 2</h1>
          <pre className="text-xs text-red-400 bg-black/50 p-6 rounded-2xl border border-red-900/50 overflow-auto text-left">
            {err.message}
          </pre>
          <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold">Retry</button>
        </div>
      </div>
    );
  }
}
