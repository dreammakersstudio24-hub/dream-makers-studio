import { createAdminClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { category_slug: string } }) {
  const supabase = createAdminClient();
  const { data: category } = await supabase
    .from('product_categories')
    .select('name')
    .eq('slug', params.category_slug)
    .single();

  return {
    title: `${category?.name || 'Products'} - Dream Makers Studio`,
  };
}

export default async function CategoryPage({ params }: { params: { category_slug: string } }) {
  const supabase = createAdminClient();
  
  // Fetch current category
  const { data: currentCategory } = await supabase
    .from('product_categories')
    .select('*')
    .eq('slug', params.category_slug)
    .single();

  if (!currentCategory) notFound();

  // Fetch all categories for navigation
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  // Fetch category products
  const { data: products } = await supabase
    .from('products')
    .select('*, product_categories(name)')
    .eq('category_id', currentCategory.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 pb-32">
      
      {/* Category Header */}
      <section className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <Link href="/shop" className="text-neutral-400 hover:text-black flex items-center gap-1 text-sm font-bold mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Shop
            </Link>
            <h1 className="text-5xl font-bold tracking-tight mb-2">{currentCategory.name}</h1>
            <p className="text-neutral-500 font-light max-w-xl">
                {currentCategory.description || `Browse our hand-picked selection of ${currentCategory.name.toLowerCase()} essentials.`}
            </p>
        </div>
        <div className="flex gap-2">
            <span className="bg-neutral-100 px-4 py-2 rounded-full text-xs font-bold text-neutral-400">
                {products?.length || 0} Items
            </span>
        </div>
      </section>

      {/* Category Navigation (Same as Main Shop) */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 mb-12">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto flex items-center justify-center gap-2 py-4 no-scrollbar">
            <Link 
              href="/shop" 
              className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-all whitespace-nowrap"
            >
                All Items
            </Link>
            {categories?.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/shop/${cat.slug}`} 
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${cat.id === currentCategory.id ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                >
                    {cat.name}
                </Link>
            ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {(!products || products.length === 0) ? (
            <div className="text-center py-32 border-2 border-dashed border-neutral-100 rounded-[40px]">
                <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <p className="text-neutral-400 font-medium">No items in this category yet</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {products.map((product) => (
                    <div key={product.id} className="group relative flex flex-col">
                        <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-neutral-100 mb-6 relative shadow-sm">
                            {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.title} 
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300"><ShoppingBag className="w-8 h-8" /></div>
                            )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{product.title}</h3>
                        <p className="text-neutral-500 text-sm font-light leading-relaxed mb-6 line-clamp-2">
                           {product.description}
                        </p>
                        <a 
                          href={product.affiliate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center justify-between w-full px-6 py-4 bg-neutral-50 rounded-2xl group/btn hover:bg-black hover:text-white transition-all duration-300"
                        >
                            <span className="font-bold text-sm tracking-wide">View on Temu</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </a>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
