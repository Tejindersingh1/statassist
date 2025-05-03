'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { MAIN_NAV } from './site-nav';
import DarkModeToggle from './DarkModeToggle';

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-white/70 backdrop-blur supports-backdrop-blur:shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold">
          StatAssist
        </Link>

        <nav className="hidden gap-6 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'text-sm transition-colors font-medium',
                pathname.startsWith(item.href)
                  ? 'text-brand-600'
                  : 'text-muted-foreground hover:text-brand-600'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <DarkModeToggle />
          {/* TODO: Avatar / account menu */}
        </div>
      </div>
    </header>
  );
}

