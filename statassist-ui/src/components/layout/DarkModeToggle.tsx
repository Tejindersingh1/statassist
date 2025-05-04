'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
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

