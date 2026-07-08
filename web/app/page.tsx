import { ChapterEditor } from '@/components/ChapterEditor';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <ChapterEditor story={{ title: 'The Immortal Path' }} />
    </main>
  );
}
