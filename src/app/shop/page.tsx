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
                            <div className="aspect-square overflow-hidden bg-[#0a0a0b] relative group-hover:bg-[#111112] transition-colors">
                                {product.image_url ? (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.title} 
                                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/5"><ShoppingBag className="w-10 h-10" /></div>
                                )}
                                
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-white/50 shadow-2xl">
                                        {(product as any).product_category_assignment?.[0]?.product_categories?.name || 'Exclusive'}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020203]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <div className="p-5 sm:p-6 flex flex-col flex-1 bg-[#020203]/40 backdrop-blur-sm">
                                <div className="flex flex-col gap-1 mb-2">
                                  <h3 className="text-xs sm:text-sm font-black text-white leading-tight uppercase tracking-tight group-hover:text-white transition-colors line-clamp-2 min-h-[2.5rem]">
                                    {product.title}
                                  </h3>
                                  
                                  {product.rating && (
                                    <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                                      {[...Array(5)].map((_, i) => (
                                        <svg 
                                          key={i} 
                                          className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-white/10 text-white/10'}`} 
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                      <span className="text-[8px] font-black ml-1 text-white/20 tracking-tighter uppercase">{product.rating.toFixed(1)}</span>
                                    </div>
                                  )}
                                </div>

                                {product.description && (
                                  <p className="text-[9px] text-white/30 font-medium line-clamp-1 mb-4 uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      {product.description}
                                  </p>
                                )}

                                <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-4">
                                    <div className="flex items-center justify-between">
                                      {product.price ? (
                                        <span className="text-sm font-black text-white tracking-widest">{product.price}</span>
                                      ) : (
                                        <span className="text-[10px] font-black text-white/10 tracking-[0.3em] uppercase">Value On Request</span>
                                      )}
                                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                      </div>
                                    </div>
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
