'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith('/app') || pathname.startsWith('/login')) return null;

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'AI App', href: '/app' },
    { name: 'Contractors', href: '/directory' },
    { name: 'Real Estate', href: '/real-estate' },
    { name: 'E-Book', href: '/ebook' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-neutral-200 bg-white/90 backdrop-blur-md text-neutral-900 shadow-sm transition-all pb-1 sm:pb-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-6">
        
        {/* Logo - First Line on Mobile */}
        <Link href="/" className="font-bold tracking-widest uppercase flex items-center gap-1 shrink-0 text-blue-900 group text-lg sm:text-base">
          Dream<span className="text-orange-500 group-hover:text-orange-400 transition-colors">Makers</span>
        </Link>
        
        <div className="w-px h-6 bg-neutral-200 shrink-0 hidden sm:block"></div>

        {/* Links - Wrap into multiple lines on Mobile */}
        <div className="flex items-center justify-center flex-wrap gap-x-1 gap-y-1 sm:gap-6 text-xs sm:text-sm font-bold tracking-wide w-full sm:w-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative transition-all duration-300 py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-full overflow-hidden group ${isActive ? 'text-blue-700' : 'text-neutral-500 hover:text-blue-900'}`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive ? (
                  <span className="absolute inset-0 bg-blue-50/80 border border-blue-100 rounded-full z-0"></span>
                ) : (
                  <span className="absolute inset-0 bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity z-0 scale-90 group-hover:scale-100 duration-300 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
