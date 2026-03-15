import { createAdminClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Shop - Dream Makers Studio',
  description: 'Browse our curated collection of luxury interior design products and furniture.',
};

export default async function ShopPage() {
  const supabase = createAdminClient();
  
  // Fetch Categories
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('*, product_categories(name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 pb-32">
      {/* Hero Section */}
      <section className="px-6 py-12 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Product Catalog</h1>
        <p className="text-neutral-500 text-lg font-light leading-relaxed">
            Curated pieces meticulously selected by the Studio to bring luxury and elegance to your home.
        </p>
      </section>

      {/* Category Navigation */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 mb-12">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto flex items-center justify-center gap-2 py-4 no-scrollbar">
            <Link 
              href="/shop" 
              className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-black text-white whitespace-nowrap"
            >
                All Items
            </Link>
            {categories?.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/shop/${cat.slug}`} 
                  className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-all whitespace-nowrap"
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
                <p className="text-neutral-400 font-medium">Coming Soon</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {products.map((product) => (
                    <div key={product.id} className="group relative flex flex-col">
                        <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-neutral-100 mb-6 relative">
                            {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.title} 
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300"><ShoppingBag className="w-8 h-8" /></div>
                            )}
                            {/* Overlay category badge */}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                                    {(product as any).product_categories?.name || 'Curated'}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors">{product.title}</h3>
                        <p className="text-neutral-500 text-sm font-light leading-relaxed mb-6 line-clamp-2">
                           {product.description}
                        </p>
                        <a 
                          href={product.affiliate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center justify-between w-full px-6 py-4 bg-neutral-50 rounded-2xl group/btn hover:bg-blue-600 hover:text-white transition-all duration-300"
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
