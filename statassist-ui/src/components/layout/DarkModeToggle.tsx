'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import useMounted from '@/lib/useMounted';

export default function DarkModeToggle() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  // Render nothing on the server; hydrate safely on the client
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <Sun className="h-5 w-5 rotate-180 transition-transform" />
      ) : (
        <Moon className="h-5 w-5 transition-transform" />
      )}
    </button>
  );
}

