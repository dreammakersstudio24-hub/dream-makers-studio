'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();

  // Hide the navbar only on the login page
  if (pathname.startsWith('/login')) return null;

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Shop', href: '/shop' },
    { name: 'AI App', href: '/app' },
    { name: 'E-Book', href: '/ebook' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-fit max-w-[95vw]">
      <div className="flex items-center bg-[#1a1d23]/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-full px-4 sm:px-6 py-2.5 gap-4 sm:gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img 
            src="/icon.png?v=3" 
            alt="Dream Makers Studio" 
            className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
          />
        </Link>
        
        {/* Links */}
        <div className="flex items-center gap-1 sm:gap-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative px-3 sm:px-4 py-1.5 transition-all duration-300 rounded-full group ${isActive ? 'text-white' : 'text-white/30 hover:text-white'}`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-0" 
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full z-0 transition-all opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
