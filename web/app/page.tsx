'use client';

import { useState } from 'react';
import { ChapterEditor } from '@/components/ChapterEditor';
import { StoryBibleBrowser } from '@/components/StoryBibleBrowser';
import { CharacterRoster } from '@/components/CharacterRoster';
import { FactionsScreen } from '@/components/FactionsScreen';
import { StoryDashboard } from '@/components/StoryDashboard';
import { Navigation } from '@/components/Navigation';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      {currentScreen === 'dashboard' && <StoryDashboard />}
      {currentScreen === 'editor' && <ChapterEditor story={{ title: 'The Immortal Path' }} />}
      {currentScreen === 'bible' && <StoryBibleBrowser />}
      {currentScreen === 'characters' && <CharacterRoster />}
      {currentScreen === 'factions' && <FactionsScreen />}
    </main>
  );
}
