'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Chapter {
  id: number;
  number: number;
  title: string;
  status: 'Drafting' | 'Bible-Checked' | 'Published';
  wordCount: number;
  content: string;
}

interface ChapterEditorProps {
  story?: {
    title: string;
  };
}

const mockChapters: Chapter[] = [
  {
    id: 1,
    number: 1,
    title: 'The Beginning',
    status: 'Published',
    wordCount: 3200,
    content: 'The mountains stretched endlessly before him...',
  },
  {
    id: 2,
    number: 2,
    title: 'First Steps',
    status: 'Bible-Checked',
    wordCount: 2850,
    content: '',
  },
  {
    id: 3,
    number: 3,
    title: 'The Revelation',
    status: 'Drafting',
    wordCount: 1540,
    content: 'The truth had finally revealed itself to him. All the years of struggle, the countless trials and tribulations, had led to this singular moment. He stood at the precipice of understanding, where the cultivation realms converged with destiny itself.',
  },
];

export function ChapterEditor({ story = { title: 'The Immortal Path' } }: ChapterEditorProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter>(mockChapters[2]);
  const [content, setContent] = useState(currentChapter.content);
  const [wordCount, setWordCount] = useState(currentChapter.wordCount);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Update word count
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  }, [content]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-success/20 text-success';
      case 'Bible-Checked':
        return 'bg-accent/20 text-accent';
      case 'Drafting':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-muted/20 text-muted';
    }
  };

  const handleRunCheck = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar - Chapter List */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-surface border-r border-surface-hover transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-surface-hover">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Chapters</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockChapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => {
                setCurrentChapter(chapter);
                setContent(chapter.content);
              }}
              className={`w-full px-4 py-3 text-left border-b border-surface-hover transition-colors ${
                currentChapter.id === chapter.id
                  ? 'bg-surface-hover'
                  : 'hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted mb-1">Ch. {chapter.number}</p>
                  <p className="text-sm font-medium truncate">{chapter.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(chapter.status)}`}>
                  {chapter.status}
                </span>
                <span className="text-xs text-muted">{chapter.wordCount} words</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Left Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="w-10 flex items-center justify-center bg-surface hover:bg-surface-hover border-r border-surface-hover transition-colors"
      >
        {sidebarOpen ? (
          <ChevronLeft size={18} className="text-accent" />
        ) : (
          <ChevronRight size={18} className="text-accent" />
        )}
      </button>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-surface border-b border-surface-hover px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Story</p>
              <h1 className="text-xl font-semibold">{story.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(currentChapter.status)}`}>
                {currentChapter.status}
              </span>
              <button
                onClick={handleRunCheck}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-background font-medium rounded transition-colors"
              >
                <Play size={16} />
                Run Check
              </button>
            </div>
          </div>

          {/* Chapter Title Input */}
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs text-muted uppercase tracking-wide mb-2">
                Chapter {currentChapter.number}: Title
              </label>
              <input
                type="text"
                value={currentChapter.title}
                onChange={(e) => setCurrentChapter({ ...currentChapter, title: e.target.value })}
                className="w-full bg-surface-hover border border-surface-hover rounded px-3 py-2 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Editor and Word Count Container */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Word Count Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10 bg-surface border border-surface-hover rounded px-3 py-1.5 text-sm font-medium text-accent">
            {wordCount} words
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin writing your chapter..."
            className="flex-1 bg-background text-foreground px-6 py-4 resize-none focus:outline-none placeholder-muted/50 text-base leading-relaxed"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>

      {/* Right Sidebar - Review Panel */}
      <div
        className={`${
          rightSidebarOpen ? 'w-80' : 'w-0'
        } bg-surface border-l border-surface-hover transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-surface-hover">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Check Results</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-surface-hover">
          <button className="flex-1 px-4 py-3 text-sm font-medium text-accent border-b-2 border-accent">
            Findings
          </button>
          <button className="flex-1 px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
            Changes
          </button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-muted text-sm">Run a consistency check to see findings here.</p>
          </div>
        </div>
      </div>

      {/* Toggle Right Sidebar */}
      {rightSidebarOpen && (
        <button
          onClick={() => setRightSidebarOpen(false)}
          className="w-10 flex items-center justify-center bg-surface hover:bg-surface-hover border-l border-surface-hover transition-colors"
        >
          <ChevronRight size={18} className="text-accent" />
        </button>
      )}
    </div>
  );
}
