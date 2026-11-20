'use client';

import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

const THEMES = [
  { id: 'friend', label: 'FRIEND', color: '#22D3EE' },
  { id: 'tactical', label: 'TACTICAL', color: '#F59E0B' },
  { id: 'overdrive', label: 'OVERDRIVE', color: '#F43F5E' }
] as const;

type ThemeId = (typeof THEMES)[number]['id'];

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeId>('friend');

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem('internshield_ui_theme') as ThemeId) || 'friend';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    document.documentElement.classList.add('dark');
  }, []);

  const cycle = () => {
    const idx = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.id);
    document.documentElement.setAttribute('data-theme', next.id);
    document.documentElement.classList.add('dark');
    localStorage.setItem('internshield_ui_theme', next.id);
  };

  if (!mounted) {
    return <div className="h-9 w-24 rounded-xl animate-pulse" style={{ background: 'var(--bg-tile)' }} />;
  }

  const active = THEMES.find((t) => t.id === theme)!;

  return (
    <button
      onClick={cycle}
      type="button"
      className="relative inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[11px] font-semibold tracking-[0.09em] uppercase"
      style={{
        background: 'var(--bg-tile)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.04)'
      }}
      title="Switch FRIDAY theme core (FRIEND / TACTICAL / OVERDRIVE)"
      aria-label="Switch visual theme mode"
    >
      <span className="h-2 w-2 rounded-full" style={{ background: active.color, boxShadow: `0 0 8px ${active.color}` }} />
      <Palette className="h-3.5 w-3.5" style={{ color: 'var(--accent-primary)' }} />
      <span style={{ color: 'var(--accent-primary)' }}>{active.label}</span>
    </button>
  );
}
