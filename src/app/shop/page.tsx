import { createAdminClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Pagination } from '@/components/Pagination';

export const metadata = {
  title: 'Shop - Dream Makers Studio',
  description: 'Browse our curated collection of luxury interior design products and furniture.',
};

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const pageSize = 40;
  
  const supabase = createAdminClient();
  
  // Total Count for Pagination
  const { count: totalItems } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Fetch Categories
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  // Fetch paginated products
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: productsData } = await supabase
    .from('products')
    .select('*, product_category_assignment(product_categories(name, slug))')
    .eq('is_active', true)
    .range(from, to);

  // Shuffle products in memory for a fresh look every visit (on current page only)
  const products = productsData 
    ? [...productsData].sort(() => Math.random() - 0.5) 
    : [];

  return (
    <div className="min-h-screen bg-[#020203] text-white pt-20 pb-32">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">The Gallery Shop</h1>
        <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto tracking-tight">
            Curated pieces meticulously selected by the Studio to bring an elite architectural aesthetic to your private residence.
        </p>
      </section>

      {/* Category Navigation */}
      <div className="sticky top-20 z-40 bg-black/40 backdrop-blur-3xl border-y border-white/5 mb-16">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto flex items-center justify-center gap-3 py-6 no-scrollbar">
            <Link 
              href="/shop" 
              className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black whitespace-nowrap"
            >
                All Pieces
            </Link>
            {categories?.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/shop/${cat.slug}`} 
                  className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
                >
                    {cat.name}
                </Link>
            ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4">
        {(!products || products.length === 0) ? (
            <div className="text-center py-40 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
                <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <p className="text-white/20 font-black uppercase tracking-[0.5em] text-sm">Awaiting Collection</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8">
                    {products.map((product) => (
                        <a 
                          key={product.id} 
                          href={product.affiliate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group bg-white/5 rounded-3xl overflow-hidden flex flex-col border border-white/5 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500"
                        >
                            <div className="aspect-[4/5] overflow-hidden bg-[#0a0a0b] relative">
                                {product.image_url ? (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.title} 
                                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/5"><ShoppingBag className="w-8 h-8" /></div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                                        {(product as any).product_category_assignment?.[0]?.product_categories?.name || 'Exclusive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-sm sm:text-base font-black text-white mb-2 leading-tight uppercase tracking-tighter group-hover:text-white transition-colors">{product.title}</h3>
                                <p className="text-[10px] text-white/30 font-medium line-clamp-2 mb-4 uppercase tracking-[0.1em]">
                                    {product.description}
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] group-hover:translate-x-1 transition-all flex items-center gap-2">
                                        Acquire <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalItems={totalItems || 0}
                    pageSize={pageSize}
                    baseUrl="/shop"
                />
            </>
        )}

        {/* Affiliate Disclosure */}
        <section className="mt-40 border-t border-white/5 pt-20 pb-20 text-center">
            <p className="text-[9px] text-white/15 font-black uppercase tracking-[0.4em] max-w-2xl mx-auto leading-loose">
                As an elite architectural partner, we may receive compensation for curated acquisitions made through these premium links. This supports the Studio's visionary research and development.
            </p>
        </section>
      </main>
    </div>
  );
}
