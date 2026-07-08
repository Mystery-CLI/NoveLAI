'use client';

import { useState } from 'react';
import { ChapterEditor } from '@/components/ChapterEditor';
import { StoryBibleBrowser } from '@/components/StoryBibleBrowser';
import { Navigation } from '@/components/Navigation';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<string>('editor');

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      {currentScreen === 'editor' && <ChapterEditor story={{ title: 'The Immortal Path' }} />}
      {currentScreen === 'bible' && <StoryBibleBrowser />}
    </main>
  );
}
