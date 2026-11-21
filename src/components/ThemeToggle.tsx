'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Light/dark switch. The pre-paint script in app/layout.tsx applies the saved
// choice before React hydrates, so the page never flashes the wrong theme;
// this component only reads that state and flips it.
export const THEME_STORAGE_KEY = 'internshield_theme';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the toggle still works for this visit.
    }
    setTheme(next);
  };

  // Same footprint before hydration, so the navbar doesn't shift.
  if (theme === null) {
    return <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800" aria-hidden="true" />;
  }

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
