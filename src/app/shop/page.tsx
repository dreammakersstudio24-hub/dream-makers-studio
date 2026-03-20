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
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-black selection:text-white pt-20 pb-32 font-sans">
      {/* Hero Section */}
      <section className="px-6 py-24 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 text-black">THE SHOP</h1>
        <p className="text-neutral-400 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto tracking-tight">
            Curated pieces meticulously selected by the Studio to bring an elite architectural aesthetic to your private residence.
        </p>
      </section>

      {/* Category Navigation */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-3xl border-y border-neutral-100 mb-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto flex items-center justify-center gap-3 py-6 no-scrollbar">
            <Link 
              href="/shop" 
              className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white whitespace-nowrap shadow-lg shadow-black/10"
            >
                All Pieces
            </Link>
            {categories?.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/shop/${cat.slug}`} 
                  className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-neutral-50 text-neutral-400 border border-neutral-100 hover:bg-neutral-100 hover:text-black transition-all whitespace-nowrap"
                >
                    {cat.name}
                </Link>
            ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4">
        {(!products || products.length === 0) ? (
            <div className="text-center py-40 bg-neutral-50 border border-neutral-100 rounded-[3rem]">
                <ShoppingBag className="w-16 h-16 text-neutral-100 mx-auto mb-6" />
                <p className="text-neutral-300 font-black uppercase tracking-[0.5em] text-sm">Awaiting Collection</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <a 
                          key={product.id} 
                          href={product.affiliate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group bg-white rounded-2xl overflow-hidden flex flex-col border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500"
                        >
                            <div className="aspect-square overflow-hidden bg-neutral-50 relative">
                                {product.image_url ? (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.title} 
                                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-100"><ShoppingBag className="w-10 h-10" /></div>
                                )}
                                
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-neutral-100 text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400 shadow-sm">
                                        {(product as any).product_category_assignment?.[0]?.product_categories?.name || 'Exclusive'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 flex flex-col flex-1">
                                <div className="flex flex-col gap-1 mb-3">
                                  <h3 className="text-xs sm:text-sm font-bold text-neutral-800 leading-tight uppercase tracking-tight group-hover:text-black transition-colors line-clamp-2 min-h-[2.5rem]">
                                    {product.title}
                                  </h3>
                                  
                                  {product.rating && (
                                    <div className="flex items-center gap-0.5 text-amber-400">
                                      {[...Array(5)].map((_, i) => (
                                        <svg 
                                          key={i} 
                                          className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-neutral-100 text-neutral-100'}`} 
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                      <span className="text-[8px] font-bold ml-1 text-neutral-300 tracking-tighter uppercase">{product.rating.toFixed(1)}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-auto flex flex-col gap-4 border-t border-neutral-50 pt-5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex flex-col">
                                        {product.price ? (
                                          <span className="text-sm font-black text-black tracking-widest">{product.price}</span>
                                        ) : (
                                          <span className="text-[10px] font-bold text-neutral-200 tracking-[0.2em] uppercase italic">Call for Price</span>
                                        )}
                                      </div>
                                      <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
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
        <section className="mt-40 border-t border-neutral-100 pt-20 pb-20 text-center">
            <p className="text-[9px] text-neutral-300 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-loose">
                As an elite architectural partner, we may receive compensation for curated acquisitions made through these premium links. This supports the Studio's visionary research and development.
            </p>
        </section>
      </main>
    </div>
  );
}
