'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith('/login')) return null;

  const links = [
    { name: 'Home', href: '/', external: false },
    { name: 'Gallery', href: '/gallery', external: false },
    { name: 'Store', href: 'https://www.amazon.com/shop/dreammakersstudio24', external: true },
    { name: 'AI App', href: '/app', external: false },
    { name: 'E-Book', href: '/ebook', external: false },
  ];

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-fit max-w-[95vw]">
      <div className="flex items-center bg-white/85 backdrop-blur-xl border border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-full px-4 sm:px-5 py-2 gap-3 sm:gap-6">
        <div className="flex items-center gap-0.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.15em]">
          {links.map((link) => {
            const isActive = !link.external && (pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href)));
            const baseClass = `relative px-1.5 sm:px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
              isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`;

            if (link.external) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseClass}
                >
                  <span className="relative z-10">{link.name}</span>
                  <div className="absolute inset-0 bg-neutral-100 rounded-full z-0 opacity-0 hover:opacity-100 transition-opacity" />
                </a>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={baseClass}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-neutral-900 rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-neutral-100 rounded-full z-0 opacity-0 hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
