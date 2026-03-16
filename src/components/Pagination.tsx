import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalItems, pageSize, baseUrl }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, 'http://localhost'); // dummy base for URL object
    url.searchParams.set('page', page.toString());
    return `${url.pathname}${url.search}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <Link
        href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
        className={`w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 transition-all ${
          currentPage > 1 ? 'hover:bg-neutral-100 text-neutral-900 shadow-sm' : 'opacity-20 cursor-not-allowed text-neutral-400'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                isActive
                  ? 'bg-black text-white shadow-lg shadow-neutral-200'
                  : 'text-neutral-500 hover:bg-neutral-50'
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link
        href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
        className={`w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 transition-all ${
          currentPage < totalPages ? 'hover:bg-neutral-100 text-neutral-900 shadow-sm' : 'opacity-20 cursor-not-allowed text-neutral-400'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
