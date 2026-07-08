'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';

interface Chapter {
  number: number;
  title: string;
  status: 'Drafting' | 'Bible-Checked' | 'Published';
  wordCount: number;
  lastCheck: string;
}

interface Story {
  title: string;
  logline: string;
}

const mockChapters: Chapter[] = [
  { number: 1, title: 'The Beginning', status: 'Published', wordCount: 4200, lastCheck: '2024-01-15' },
  { number: 2, title: 'Ascension Begins', status: 'Published', wordCount: 5100, lastCheck: '2024-01-18' },
  { number: 3, title: 'The First Trial', status: 'Bible-Checked', wordCount: 4800, lastCheck: '2024-01-22' },
  { number: 4, title: 'Shadows of Intent', status: 'Drafting', wordCount: 3200, lastCheck: '2024-01-25' },
  { number: 5, title: 'Breakthrough', status: 'Drafting', wordCount: 2100, lastCheck: '2024-01-28' },
  { number: 6, title: 'The Sect Summit', status: 'Drafting', wordCount: 0, lastCheck: 'Never' },
];

export function StoryDashboard() {
  const [sortColumn, setSortColumn] = useState<'number' | 'title' | 'status' | 'wordCount' | 'lastCheck'>('number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedChapters = () => {
    const sorted = [...mockChapters].sort((a, b) => {
      let aVal: any = a[sortColumn];
      let bVal: any = b[sortColumn];

      if (aVal === 'Never') aVal = new Date('1900-01-01');
      if (bVal === 'Never') bVal = new Date('1900-01-01');
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const totalChapters = mockChapters.length;
  const totalWords = mockChapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  const pendingReviews = mockChapters.filter(ch => ch.status === 'Drafting').length;
  const forecastItems = 3;

  const statusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-success/10 text-success border-success/30';
      case 'Bible-Checked':
        return 'bg-accent/10 text-accent border-accent/30';
      case 'Drafting':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-muted/10 text-muted border-muted/30';
    }
  };

  const SortIcon = ({ column }: { column: typeof sortColumn }) => {
    if (sortColumn !== column) return <ChevronDown size={14} className="opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-surface-hover p-6 bg-surface/30">
        <h1 className="text-3xl font-bold text-foreground text-balance">{mockChapters[0] ? 'The Immortal Path' : 'Untitled Story'}</h1>
        <p className="text-muted mt-2 text-base text-pretty">
          A tale of cultivation, power, and the price of immortality in a world of hidden realms and ancient secrets.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-surface-hover">
        <div className="bg-surface border border-surface-hover rounded-lg p-4">
          <p className="text-muted text-sm uppercase tracking-wide">Total Chapters</p>
          <p className="text-2xl font-bold text-accent mt-2">{totalChapters}</p>
        </div>

        <div className="bg-surface border border-surface-hover rounded-lg p-4">
          <p className="text-muted text-sm uppercase tracking-wide">Total Words</p>
          <p className="text-2xl font-bold text-accent mt-2">{totalWords.toLocaleString()}</p>
        </div>

        <div className="bg-surface border border-surface-hover rounded-lg p-4">
          <p className="text-muted text-sm uppercase tracking-wide">Pending Review</p>
          <p className="text-2xl font-bold text-warning mt-2">{pendingReviews}</p>
        </div>

        <div className="bg-surface border border-surface-hover rounded-lg p-4">
          <p className="text-muted text-sm uppercase tracking-wide">Foreshadow Items</p>
          <p className="text-2xl font-bold text-info mt-2">{forecastItems}</p>
        </div>
      </div>

      {/* Chapter Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Chapters</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent-dark transition-colors">
            <Plus size={18} /> New Chapter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-surface-hover">
                <th className="text-left py-3 px-4 text-muted text-sm font-semibold uppercase tracking-wide">
                  <button
                    onClick={() => handleSort('number')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    No. <SortIcon column="number" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-muted text-sm font-semibold uppercase tracking-wide">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Title <SortIcon column="title" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-muted text-sm font-semibold uppercase tracking-wide">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Status <SortIcon column="status" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-muted text-sm font-semibold uppercase tracking-wide">
                  <button
                    onClick={() => handleSort('wordCount')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Word Count <SortIcon column="wordCount" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-muted text-sm font-semibold uppercase tracking-wide">
                  <button
                    onClick={() => handleSort('lastCheck')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Last Check <SortIcon column="lastCheck" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedChapters().map((chapter) => (
                <tr key={chapter.number} className="border-b border-surface-hover hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">Ch. {chapter.number}</td>
                  <td className="py-3 px-4 text-foreground">{chapter.title}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColor(chapter.status)}`}>
                      {chapter.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground">{chapter.wordCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted text-sm">{chapter.lastCheck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
