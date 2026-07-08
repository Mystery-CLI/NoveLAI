'use client';

import { BookOpen, Feather, Users, Shield } from 'lucide-react';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  return (
    <nav className="absolute top-4 left-4 flex gap-2">
      <button
        onClick={() => onNavigate('editor')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          currentScreen === 'editor'
            ? 'bg-accent text-background'
            : 'bg-surface border border-surface-hover text-foreground hover:border-accent'
        }`}
      >
        <Feather size={18} /> Chapter Editor
      </button>
      <button
        onClick={() => onNavigate('bible')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          currentScreen === 'bible'
            ? 'bg-accent text-background'
            : 'bg-surface border border-surface-hover text-foreground hover:border-accent'
        }`}
      >
        <BookOpen size={18} /> Story Bible
      </button>
      <button
        onClick={() => onNavigate('characters')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          currentScreen === 'characters'
            ? 'bg-accent text-background'
            : 'bg-surface border border-surface-hover text-foreground hover:border-accent'
        }`}
      >
        <Users size={18} /> Characters
      </button>
      <button
        onClick={() => onNavigate('factions')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          currentScreen === 'factions'
            ? 'bg-accent text-background'
            : 'bg-surface border border-surface-hover text-foreground hover:border-accent'
        }`}
      >
        <Shield size={18} /> Factions
      </button>
    </nav>
  );
}
