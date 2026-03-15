import { createAdminClient, createServerSupabaseClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Plus, Trash2, Edit3, FolderPlus, Tag, Package, ExternalLink } from 'lucide-react';
import { createCategory, deleteCategory, upsertProduct, deleteProduct } from '@/actions/shop';

export const metadata = {
  title: 'Shop Manager - Admin',
};

const ADMIN_EMAILS = ['dreammakersstudio24@gmail.com'];

export default async function ShopAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect('/app/dashboard');
  }

  const supabaseAdmin = createAdminClient();
  
  // Fetch Categories with safety
  const { data: categories, error: catError } = await supabaseAdmin
    .from('product_categories')
    .select('*')
    .order('name');

  // Fetch Products with safety - using separate queries if join fails
  const { data: products, error: prodError } = await supabaseAdmin
    .from('products')
    .select('*, product_categories(name)')
    .order('created_at', { ascending: false });

  // Determine if there's a serious database error (like missing tables)
  const isTableMissing = catError?.code === 'P0001' || prodError?.code === 'P0001' || catError?.message?.includes('does not exist') || prodError?.message?.includes('does not exist');

  if (isTableMissing) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-[40px] shadow-xl border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Database Setup Required</h1>
            <p className="text-neutral-500 mb-8 text-sm">
                It looks like the Shop database tables haven't been created yet in Supabase.
            </p>
            <div className="bg-neutral-50 p-4 rounded-2xl text-left mb-8">
                <p className="text-[10px] font-bold uppercase text-neutral-400 mb-2">Instructions</p>
                <ol className="text-xs text-neutral-600 space-y-2 list-decimal ml-4">
                    <li>Open your Supabase Dashboard</li>
                    <li>Go to the <b>SQL Editor</b></li>
                    <li>Paste the SQL script provided by the assistant</li>
                    <li>Click <b>Run</b></li>
                </ol>
            </div>
            <a href="/app/dashboard" className="inline-block w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all">
                Back to Dashboard
            </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <header className="bg-white border-b border-neutral-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <h1 className="font-bold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" /> Shop Manager
        </h1>
        <div className="flex gap-4">
            <a href="/shop" target="_blank" className="text-sm font-medium text-neutral-500 hover:text-black flex items-center gap-1">
                View Public Shop <ExternalLink className="w-4 h-4" />
            </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        
        {/* --- Category Management --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Tag className="w-5 h-5" /> Pages & Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Category Form */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm h-fit">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-400">
                  <FolderPlus className="w-4 h-4" /> Create New Page
              </h3>
              <form action={createCategory} className="space-y-4">
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Category Name (e.g. Sofa)" 
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all">
                  Create Page
                </button>
              </form>
            </div>

            {/* Category List */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories?.map((cat) => (
                <div key={cat.id} className="bg-white px-5 py-4 rounded-2xl border border-neutral-200 flex items-center justify-between group shadow-sm">
                  <div>
                    <p className="font-bold text-sm">{cat.name}</p>
                    <p className="text-xs text-neutral-400 truncate max-w-[150px]">/shop/{cat.slug}</p>
                  </div>
                  <form action={deleteCategory.bind(null, cat.id)}>
                    <button className="text-neutral-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-neutral-200" />

        {/* --- Product Management --- */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-5 h-5" /> Product Catalog
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Add/Edit Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm sticky top-24">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-400">
                    <Plus className="w-4 h-4" /> Add Product
                </h3>
                <form action={upsertProduct} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Title</label>
                    <input name="title" required className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Affiliate Link</label>
                    <input name="affiliate_url" required placeholder="https://temu.com/..." className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Category</label>
                    <select name="category_id" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm appearance-none bg-white">
                        <option value="">No Category</option>
                        {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Product Image</label>
                    <input type="file" name="image" accept="image/*" className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Description</label>
                    <textarea name="description" rows={3} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Upload Product
                  </button>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products?.map((p) => (
                  <div key={p.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-neutral-100 relative">
                        {p.image_url && <img src={p.image_url} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                        <div className="absolute top-3 right-3 flex gap-2">
                             <form action={deleteProduct.bind(null, p.id)}>
                                <button className="bg-white/90 backdrop-blur shadow-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                             </form>
                        </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {(p as any).product_categories?.name || 'Uncategorized'}
                        </span>
                      </div>
                      <h4 className="font-bold text-neutral-800 line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
