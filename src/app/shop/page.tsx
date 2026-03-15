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
      <main className="max-w-7xl mx-auto px-4">
        {(!products || products.length === 0) ? (
            <div className="text-center py-32 border-2 border-dashed border-neutral-100 rounded-[40px]">
                <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <p className="text-neutral-400 font-medium">Coming Soon</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                {products.map((product) => (
                    <a 
                      key={product.id} 
                      href={product.affiliate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group bg-neutral-50 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col border border-transparent hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
                    >
                        <div className="aspect-square overflow-hidden bg-white relative">
                            {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.title} 
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-200 bg-neutral-50"><ShoppingBag className="w-6 h-6" /></div>
                            )}
                            <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 rounded-md bg-white/80 backdrop-blur text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                                    {(product as any).product_categories?.name || 'Curated'}
                                </span>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4 flex flex-col flex-1">
                            <h3 className="text-sm sm:text-base font-bold text-neutral-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{product.title}</h3>
                            <p className="text-[10px] sm:text-xs text-neutral-400 font-light line-clamp-2 mb-3">
                                {product.description}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter sm:tracking-normal group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Shop Now <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        )}

        {/* Affiliate Disclosure */}
        <section className="mt-32 border-t border-neutral-100 pt-12 pb-20 text-center">
            <p className="text-[10px] text-neutral-300 font-medium uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose">
                As an affiliate partner, we may earn a commission from qualifying purchases made through our links to Amazon, Temu, and other marketplaces. This helps support the Studio at no additional cost to you.
            </p>
        </section>
      </main>
    </div>
  );
}
