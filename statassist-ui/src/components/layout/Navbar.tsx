import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold">Stat-Assist</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/studies" 
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/studies') 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              My Studies
            </Link>
            <Link 
              href="/resources" 
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/resources') 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Resources
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/studies/new">
            <Button>New Study</Button>
          </Link>
          <div className="relative h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <span className="text-xs font-medium">US</span>
          </div>
        </div>
      </div>
    </header>
  );
}
