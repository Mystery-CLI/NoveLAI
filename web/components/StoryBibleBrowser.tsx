'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Check, X } from 'lucide-react';

type Tab = 'rules' | 'cultivation' | 'paths';
type RuleCategory = 'Character Code' | 'Cast Rule' | 'Prose Style' | 'Structural Rule';
type RuleStrength = 'hard' | 'soft';

interface Rule {
  id: string;
  category: RuleCategory;
  title: string;
  description: string;
  strength: RuleStrength;
  editing?: boolean;
  editTitle?: string;
  editDescription?: string;
}

interface CultivationTier {
  id: string;
  realmName: string;
  subLevel: string;
  lifespanCap: string;
  isMinorBoundary?: boolean;
  editing?: boolean;
  editRealmName?: string;
  editSubLevel?: string;
  editLifespanCap?: string;
}

interface PowerPath {
  id: string;
  name: string;
  description: string;
  editing?: boolean;
  editName?: string;
  editDescription?: string;
}

const categoryColors: Record<RuleCategory, string> = {
  'Character Code': 'bg-amber-900 text-amber-100',
  'Cast Rule': 'bg-blue-900 text-blue-100',
  'Prose Style': 'bg-purple-900 text-purple-100',
  'Structural Rule': 'bg-green-900 text-green-100',
};

export function StoryBibleBrowser() {
  const [activeTab, setActiveTab] = useState<Tab>('rules');
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      category: 'Character Code',
      title: 'Core Personality Consistency',
      description: 'Each character must maintain their established personality traits across all chapters.',
      strength: 'hard',
    },
    {
      id: '2',
      category: 'Cast Rule',
      title: 'Realm Advancement Logic',
      description: 'Character realm advances must follow the cultivation system rules and progression.',
      strength: 'hard',
    },
    {
      id: '3',
      category: 'Prose Style',
      title: 'Dialogue Tags',
      description: 'Use consistent dialogue attribution style throughout.',
      strength: 'soft',
    },
  ]);

  const [tiers, setTiers] = useState<CultivationTier[]>([
    { id: '1', realmName: 'Foundation Establishment', subLevel: '1-9', lifespanCap: '200', isMinorBoundary: false },
    { id: '2', realmName: 'Core Formation', subLevel: '1-9', lifespanCap: '500', isMinorBoundary: true },
    { id: '3', realmName: 'Nascent Soul', subLevel: '1-9', lifespanCap: '1000', isMinorBoundary: false },
    { id: '4', realmName: 'Spirit Transformation', subLevel: '1-9', lifespanCap: '2000', isMinorBoundary: true },
  ]);

  const [paths, setPaths] = useState<PowerPath[]>([
    { id: '1', name: 'Sword Cultivation', description: 'Path of mastering sword techniques and qi control' },
    { id: '2', name: 'Alchemy', description: 'Path of pill refining and potion creation' },
    { id: '3', name: 'Beast Taming', description: 'Path of bonding with spiritual beasts' },
  ]);

  // Rules handlers
  const handleEditRule = (id: string) => {
    setRules(
      rules.map((r) =>
        r.id === id
          ? { ...r, editing: true, editTitle: r.title, editDescription: r.description }
          : r
      )
    );
  };

  const handleSaveRule = (id: string) => {
    setRules(
      rules.map((r) =>
        r.id === id
          ? {
              ...r,
              editing: false,
              title: r.editTitle || r.title,
              description: r.editDescription || r.description,
            }
          : r
      )
    );
  };

  const handleCancelRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, editing: false } : r)));
  };

  const handleAddRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      category: 'Character Code',
      title: 'New Rule',
      description: 'Rule description',
      strength: 'soft',
      editing: true,
      editTitle: 'New Rule',
      editDescription: 'Rule description',
    };
    setRules([...rules, newRule]);
  };

  // Cultivation handlers
  const handleEditTier = (id: string) => {
    setTiers(
      tiers.map((t) =>
        t.id === id
          ? {
              ...t,
              editing: true,
              editRealmName: t.realmName,
              editSubLevel: t.subLevel,
              editLifespanCap: t.lifespanCap,
            }
          : t
      )
    );
  };

  const handleSaveTier = (id: string) => {
    setTiers(
      tiers.map((t) =>
        t.id === id
          ? {
              ...t,
              editing: false,
              realmName: t.editRealmName || t.realmName,
              subLevel: t.editSubLevel || t.subLevel,
              lifespanCap: t.editLifespanCap || t.lifespanCap,
            }
          : t
      )
    );
  };

  const handleCancelTier = (id: string) => {
    setTiers(tiers.map((t) => (t.id === id ? { ...t, editing: false } : t)));
  };

  const handleAddTier = () => {
    const newTier: CultivationTier = {
      id: Date.now().toString(),
      realmName: 'New Realm',
      subLevel: '1-9',
      lifespanCap: '100',
      editing: true,
      editRealmName: 'New Realm',
      editSubLevel: '1-9',
      editLifespanCap: '100',
    };
    setTiers([...tiers, newTier]);
  };

  // Paths handlers
  const handleEditPath = (id: string) => {
    setPaths(
      paths.map((p) =>
        p.id === id
          ? { ...p, editing: true, editName: p.name, editDescription: p.description }
          : p
      )
    );
  };

  const handleSavePath = (id: string) => {
    setPaths(
      paths.map((p) =>
        p.id === id
          ? {
              ...p,
              editing: false,
              name: p.editName || p.name,
              description: p.editDescription || p.description,
            }
          : p
      )
    );
  };

  const handleCancelPath = (id: string) => {
    setPaths(paths.map((p) => (p.id === id ? { ...p, editing: false } : p)));
  };

  const handleAddPath = () => {
    const newPath: PowerPath = {
      id: Date.now().toString(),
      name: 'New Path',
      description: 'Path description',
      editing: true,
      editName: 'New Path',
      editDescription: 'Path description',
    };
    setPaths([...paths, newPath]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-surface-hover px-8 py-6">
        <h1 className="text-2xl font-bold text-accent">Story Bible</h1>
        <p className="text-sm text-muted mt-1">Rules, cultivation tiers, and power paths</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-hover px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-4 px-1 font-medium text-sm transition-colors ${
              activeTab === 'rules'
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Rules
          </button>
          <button
            onClick={() => setActiveTab('cultivation')}
            className={`py-4 px-1 font-medium text-sm transition-colors ${
              activeTab === 'cultivation'
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Cultivation Ladder
          </button>
          <button
            onClick={() => setActiveTab('paths')}
            className={`py-4 px-1 font-medium text-sm transition-colors ${
              activeTab === 'paths'
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Power Paths
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4 max-w-4xl">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-surface border border-surface-hover rounded-lg p-6 hover:border-accent transition-colors"
              >
                {!rule.editing ? (
                  <>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${categoryColors[rule.category]}`}>
                          {rule.category}
                        </span>
                        <div
                          className={`mt-0.5 w-3 h-3 rounded-full flex-shrink-0 ${
                            rule.strength === 'hard' ? 'bg-danger' : 'bg-accent'
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => handleEditRule(rule.id)}
                        className="text-muted hover:text-accent text-sm transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:text-accent" onClick={() => handleEditRule(rule.id)}>
                      {rule.title}
                    </h3>
                    <p className="text-muted text-sm">{rule.description}</p>
                    <p className="text-xs text-muted mt-3">
                      {rule.strength === 'hard' ? '🔴 Hard Rule' : '🟡 Soft Rule'}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted uppercase">Title</label>
                        <input
                          type="text"
                          value={rule.editTitle || ''}
                          onChange={(e) =>
                            setRules(
                              rules.map((r) =>
                                r.id === rule.id ? { ...r, editTitle: e.target.value } : r
                              )
                            )
                          }
                          className="w-full bg-background border border-surface-hover rounded mt-1 px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted uppercase">Description</label>
                        <textarea
                          value={rule.editDescription || ''}
                          onChange={(e) =>
                            setRules(
                              rules.map((r) =>
                                r.id === rule.id ? { ...r, editDescription: e.target.value } : r
                              )
                            )
                          }
                          className="w-full bg-background border border-surface-hover rounded mt-1 px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSaveRule(rule.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-success text-background rounded text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        <Check size={16} /> Save
                      </button>
                      <button
                        onClick={() => handleCancelRule(rule.id)}
                        className="px-3 py-2 bg-surface-hover text-foreground rounded text-sm font-medium hover:bg-surface-hover transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <button
              onClick={handleAddRule}
              className="flex items-center gap-2 px-4 py-3 bg-surface border border-surface-hover rounded-lg text-accent hover:border-accent transition-colors font-medium text-sm"
            >
              <Plus size={18} /> Add Rule
            </button>
          </div>
        )}

        {/* Cultivation Ladder Tab */}
        {activeTab === 'cultivation' && (
          <div className="max-w-2xl">
            <div className="space-y-2">
              {tiers.map((tier, index) => (
                <div key={tier.id}>
                  {tier.isMinorBoundary && index > 0 && (
                    <div className="flex items-center gap-4 py-4 px-4">
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-accent to-transparent" />
                      <span className="text-xs text-muted font-medium uppercase">Major Boundary</span>
                      <div className="flex-1 h-0.5 bg-gradient-to-l from-accent to-transparent" />
                    </div>
                  )}
                  <div className="bg-surface border border-surface-hover rounded-lg p-6 hover:border-accent transition-colors">
                    {!tier.editing ? (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-accent cursor-pointer hover:opacity-80" onClick={() => handleEditTier(tier.id)}>
                            {tier.realmName}
                          </h3>
                          <button
                            onClick={() => handleEditTier(tier.id)}
                            className="text-muted hover:text-accent text-sm transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <p className="text-muted mb-1">Sub-levels</p>
                            <p className="font-medium">{tier.subLevel}</p>
                          </div>
                          <div>
                            <p className="text-muted mb-1">Lifespan Cap</p>
                            <p className="font-medium">{tier.lifespanCap} years</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-muted uppercase">Realm Name</label>
                            <input
                              type="text"
                              value={tier.editRealmName || ''}
                              onChange={(e) =>
                                setTiers(
                                  tiers.map((t) =>
                                    t.id === tier.id ? { ...t, editRealmName: e.target.value } : t
                                  )
                                )
                              }
                              className="w-full bg-background border border-surface-hover rounded mt-1 px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-muted uppercase">Sub-levels</label>
                              <input
                                type="text"
                                value={tier.editSubLevel || ''}
                                onChange={(e) =>
                                  setTiers(
                                    tiers.map((t) =>
                                      t.id === tier.id ? { ...t, editSubLevel: e.target.value } : t
                                    )
                                  )
                                }
                                className="w-full bg-background border border-surface-hover rounded mt-1 px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted uppercase">Lifespan Cap</label>
                              <input
                                type="text"
                                value={tier.editLifespanCap || ''}
                                onChange={(e) =>
                                  setTiers(
                                    tiers.map((t) =>
                                      t.id === tier.id ? { ...t, editLifespanCap: e.target.value } : t
                                    )
                                  )
                                }
                                className="w-full bg-background border border-surface-hover rounded mt-1 px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleSaveTier(tier.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-success text-background rounded text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            <Check size={16} /> Save
                          </button>
                          <button
                            onClick={() => handleCancelTier(tier.id)}
                            className="px-3 py-2 bg-surface-hover text-foreground rounded text-sm font-medium hover:bg-surface-hover transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddTier}
              className="mt-6 flex items-center gap-2 px-4 py-3 bg-surface border border-surface-hover rounded-lg text-accent hover:border-accent transition-colors font-medium text-sm"
            >
              <Plus size={18} /> Add Tier
            </button>
          </div>
        )}

        {/* Power Paths Tab */}
        {activeTab === 'paths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            {paths.map((path) => (
              <div
                key={path.id}
                className="bg-surface border border-surface-hover rounded-lg p-6 hover:border-accent transition-colors"
              >
                {!path.editing ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold flex-1 cursor-pointer hover:text-accent" onClick={() => handleEditPath(path.id)}>
                        {path.name}
                      </h3>
                      <button
                        onClick={() => handleEditPath(path.id)}
                        className="text-muted hover:text-accent text-sm transition-colors ml-2"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-muted text-sm">{path.description}</p>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted uppercase">Path Name</label>
                        <input
                          type="text"
                          value={path.editName || ''}
                          onChange={(e) =>
                            setPaths(
                              paths.map((p) =>
                                p.id === path.id ? { ...p, editName: e.target.value } : p
                              )
                            )
                          }
                          className="w-full bg-background border border-surface-hover rounded mt-1 px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted uppercase">Description</label>
                        <textarea
                          value={path.editDescription || ''}
                          onChange={(e) =>
                            setPaths(
                              paths.map((p) =>
                                p.id === path.id ? { ...p, editDescription: e.target.value } : p
                              )
                            )
                          }
                          className="w-full bg-background border border-surface-hover rounded mt-1 px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSavePath(path.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-success text-background rounded text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        <Check size={16} /> Save
                      </button>
                      <button
                        onClick={() => handleCancelPath(path.id)}
                        className="px-3 py-2 bg-surface-hover text-foreground rounded text-sm font-medium hover:bg-surface-hover transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <button
              onClick={handleAddPath}
              className="flex items-center justify-center gap-2 bg-surface border border-surface-hover rounded-lg p-6 text-accent hover:border-accent transition-colors font-medium"
            >
              <Plus size={24} /> Add Path
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
