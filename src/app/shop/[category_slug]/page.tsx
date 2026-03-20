import { createAdminClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Pagination } from '@/components/Pagination';

interface CategoryPageProps {
  params: Promise<{ category_slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ category_slug: string }> }) {
  const { category_slug } = await params;
  const supabase = createAdminClient();
  const { data: category } = await supabase
    .from('product_categories')
    .select('name')
    .eq('slug', category_slug)
    .single();

  return {
    title: `${category?.name || 'Products'} - Dream Makers Studio`,
  };
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category_slug } = await params;
  const p = await searchParams;
  const currentPage = parseInt(p.page || '1', 10);
  const pageSize = 40;

  const supabase = createAdminClient();
  
  // Fetch current category
  const { data: currentCategory } = await supabase
    .from('product_categories')
    .select('*')
    .eq('slug', category_slug)
    .single();

  if (!currentCategory) notFound();

  // Fetch all categories for navigation
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  // Count products in category
  const { count: totalItems } = await supabase
    .from('product_category_assignment')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', currentCategory.id);

  // Fetch paginated products via junction table
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: assignments } = await supabase
    .from('product_category_assignment')
    .select('products(*)')
    .eq('category_id', currentCategory.id)
    .range(from, to);

  // Filter out any null assignments or inactive products and shuffle
  const products = assignments
    ? assignments
        .map((a: any) => a.products)
        .filter((p: any) => p && p.is_active)
        .sort(() => Math.random() - 0.5)
    : [];

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
                {totalItems || 0} Items
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
      <main className="max-w-7xl mx-auto px-4">
        {(!products || products.length === 0) ? (
            <div className="text-center py-32 border-2 border-dashed border-neutral-100 rounded-[40px]">
                <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <p className="text-neutral-400 font-medium">No items in this category yet</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {products.map((product) => (
                        <a 
                          key={product.id} 
                          href={product.affiliate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group bg-white rounded-2xl overflow-hidden flex flex-col border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
                        >
                            <div className="aspect-square overflow-hidden bg-neutral-50 relative">
                                {product.image_url ? (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.title} 
                                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-200 bg-neutral-50"><ShoppingBag className="w-6 h-6" /></div>
                                )}
                            </div>
                            <div className="p-4 sm:p-5 flex flex-col flex-1">
                                <div className="flex flex-col gap-1 mb-2">
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

                                <div className="mt-auto flex flex-col gap-4 border-t border-neutral-50 pt-4">
                                    <div className="flex items-center justify-between">
                                      {product.price ? (
                                        <span className="text-sm font-black text-black tracking-widest">{product.price}</span>
                                      ) : (
                                        <span className="text-[10px] font-bold text-neutral-200 tracking-[0.2em] uppercase italic">Call for Price</span>
                                      )}
                                      <div className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
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
                    baseUrl={`/shop/${category_slug}`}
                />
            </>
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
