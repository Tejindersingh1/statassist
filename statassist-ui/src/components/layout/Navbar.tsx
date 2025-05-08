import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/analysis", label: "Analysis" },
    { href: "/studies", label: "Studies" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Stat-Assist
          </Link>
          <nav className="hidden md:flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
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
