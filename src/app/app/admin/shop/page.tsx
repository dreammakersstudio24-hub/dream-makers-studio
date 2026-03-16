import { createAdminClient, createServerSupabaseClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Package, Tag, AlertTriangle, Upload, FileText, Plus, Trash2, ExternalLink } from 'lucide-react';
import { createCategory, deleteCategory, upsertProduct, deleteProduct, importProductsFromCSV, clearAllProducts } from '@/actions/shop';

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

    // Level 3: Fetch Products with complex join
    const { data: products, error: prodError } = await supabaseAdmin
        .from('products')
        .select('*, product_category_assignment(category_id, product_categories(name))')
        .order('created_at', { ascending: false });

    if (catError) throw catError;
    if (prodError) throw prodError;

    return (
      <div className="p-20 bg-neutral-50 min-h-screen text-neutral-900">
        <h1 className="text-4xl font-black mb-8 flex items-center gap-3">
          <Package className="w-10 h-10 text-blue-600" /> Shop Manager
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-neutral-200 shadow-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-neutral-400" /> Page Isolation Test: Level 3
                </h2>
                <p className="text-neutral-500 mb-8 leading-relaxed">
                    Imports verified. Product query successful. <br/>
                    Found <strong>{products?.length || 0}</strong> products in catalog.
                </p>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {products?.map((p: any) => (
                        <div key={p.id} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex justify-between items-center group">
                            <span className="font-bold text-sm truncate max-w-[200px]">{p.title}</span>
                            <div className="flex gap-2">
                                {p.product_category_assignment?.map((a: any) => (
                                    <span key={a.category_id} className="text-[8px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-black uppercase">
                                        {a.product_categories?.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-[40px] shadow-xl shadow-blue-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5" /> Import Test
                </h2>
                <p className="text-blue-100 text-sm mb-6">If you can see this section, the import of "upsertProduct" and other actions is working.</p>
                <div className="p-4 bg-blue-700/50 rounded-2xl border border-blue-400/20 text-xs font-mono">
                    Actions Loaded: createCategory, deleteCategory, upsertProduct, ...
                </div>
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
          <h1 className="text-2xl font-black text-red-500 mb-4">CRASH AT LEVEL 3</h1>
          <pre className="text-xs text-red-400 bg-black/50 p-6 rounded-2xl border border-red-900/50 overflow-auto text-left">
            {err.message}
          </pre>
          <p className="mt-4 text-[10px] text-neutral-500">Hint: If it says 'Module not found', check the imports.</p>
          <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold">Retry</button>
        </div>
      </div>
    );
  }
}
