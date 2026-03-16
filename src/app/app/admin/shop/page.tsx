import { createAdminClient, createServerSupabaseClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Plus, Trash2, Edit3, FolderPlus, Tag, Package, ExternalLink, Upload, FileText, AlertTriangle } from 'lucide-react';
import { createCategory, deleteCategory, upsertProduct, deleteProduct, importProductsFromCSV, clearAllProducts } from '@/actions/shop';

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

  // Fetch Products with many-to-many categories
  const { data: products, error: prodError } = await supabaseAdmin
    .from('products')
    .select('*, product_category_assignment(category_id, product_categories(name))')
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
        
        {/* --- Bulk Import & Categories Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Category Management */}
            <section className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Tag className="w-5 h-5" /> Pages & Categories
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Create Category Form */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-400">
                            <Plus className="w-4 h-4" /> Create New Page
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
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        {categories?.map((cat) => (
                            <div key={cat.id} className="bg-white px-5 py-4 rounded-2xl border border-neutral-200 flex items-center justify-between group shadow-sm">
                            <div>
                                <p className="font-bold text-sm">{cat.name}</p>
                                <p className="text-xs text-neutral-400 truncate max-w-[120px]">/shop/{cat.slug}</p>
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

            {/* Bulk CSV Import */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                    <Upload className="w-5 h-5" /> Bulk Import
                </h2>
                <div className="bg-blue-600 text-white p-6 rounded-[32px] shadow-lg shadow-blue-100">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-widest opacity-80">
                        <FileText className="w-4 h-4" /> Import Products (CSV)
                    </h3>
                    <p className="text-xs opacity-70 mb-6 leading-relaxed">
                        Upload a CSV file with headers: <br/>
                        <code className="bg-blue-700/50 px-1 rounded">title, description, image_url, affiliate_url, category</code><br/>
                        Use <code className="bg-blue-700/50 px-1 rounded">|</code> to separate multiple categories.
                    </p>
                    <form action={importProductsFromCSV} className="space-y-4">
                        <input 
                          type="file" 
                          name="file" 
                          accept=".csv"
                          required
                          className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-white file:text-blue-600 hover:file:bg-neutral-100 cursor-pointer" 
                        />
                        <button type="submit" className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-sm hover:bg-neutral-100 transition-all">
                            Start Bulk Import
                        </button>
                    </form>
                </div>
            </section>
        </div>

        <hr className="border-neutral-200" />

        {/* --- Product Management --- */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-5 h-5" /> Product Catalog
            </h2>
            <form action={clearAllProducts} onSubmit={(e) => !confirm('Are you sure you want to delete ALL products?') && e.preventDefault()}>
                <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-4 py-2 rounded-full transition-colors">
                    <AlertTriangle className="w-3 h-3" /> Clear All Products
                </button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Add/Edit Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-[32px] border border-neutral-200 shadow-sm sticky top-24">
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
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">External Image URL (Optional)</label>
                    <input name="external_image_url" placeholder="https://..." className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Upload Image (If no URL)</label>
                    <input type="file" name="image" accept="image/*" className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-2">Categories (Select Multiple)</label>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto border border-neutral-100 rounded-xl p-3 bg-neutral-50/50">
                        {categories?.map(c => (
                            <label key={c.id} className="flex items-center gap-3 text-xs cursor-pointer group">
                                <input type="checkbox" name="category_ids" value={c.id} className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-neutral-600 group-hover:text-black">{c.name}</span>
                            </label>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Description</label>
                    <textarea name="description" rows={3} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Save Product
                  </button>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products?.map((p) => {
                  const assignedCategories = (p as any).product_category_assignment?.map((a: any) => a.product_categories?.name).filter(Boolean);
                  
                  return (
                    <div key={p.id} className="bg-white rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
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
                        <div className="flex flex-wrap gap-1 mb-2">
                          {assignedCategories?.length > 0 ? assignedCategories.map((name: string) => (
                              <span key={name} className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                  {name}
                              </span>
                          )) : (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-md">
                                  Uncategorized
                              </span>
                          )}
                        </div>
                        <h4 className="font-bold text-neutral-800 line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
