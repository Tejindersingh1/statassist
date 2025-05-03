import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">StatAssist</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link 
              href="/dashboard" 
              className={`text-base font-medium transition-colors ${
                pathname === '/dashboard' || pathname === '/' 
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/studies" 
              className={`text-base font-medium transition-colors ${
                pathname.startsWith('/studies') 
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              My Studies
            </Link>
            <Link 
              href="/resources" 
              className={`text-base font-medium transition-colors ${
                pathname.startsWith('/resources') 
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Resources
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <span className="text-sm font-medium">US</span>
          </div>
        </div>
      </div>
    </header>
  );
}
