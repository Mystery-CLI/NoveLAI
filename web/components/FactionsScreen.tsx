'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Plus } from 'lucide-react';

interface Character {
  id: string;
  name: string;
}

interface Faction {
  id: string;
  name: string;
  type: 'Clan' | 'Sect' | 'Holy Land' | 'Evil Sect' | 'Empire';
  hostility: 1 | 2 | 3 | 4 | 5;
  standingNotes: string;
  memberCharacters: Character[];
}

const mockFactions: Faction[] = [
  {
    id: '1',
    name: 'Azure Phoenix Sect',
    type: 'Sect',
    hostility: 2,
    standingNotes: 'Neutral allies, trade relationships established',
    memberCharacters: [{ id: '1', name: 'Li Wei' }, { id: '2', name: 'Mei Lin' }],
  },
  {
    id: '2',
    name: 'Heavenly Sword Clan',
    type: 'Clan',
    hostility: 4,
    standingNotes: 'Rivals over the Northern Peaks resources',
    memberCharacters: [{ id: '3', name: 'Zhang Tian' }],
  },
  {
    id: '3',
    name: 'Temple of the Golden Buddha',
    type: 'Holy Land',
    hostility: 1,
    standingNotes: 'Peaceful coexistence, spiritual cooperation',
    memberCharacters: [{ id: '4', name: 'Abbot Chen' }],
  },
  {
    id: '4',
    name: 'The Crimson Cabal',
    type: 'Evil Sect',
    hostility: 5,
    standingNotes: 'Active enemies, constant conflict',
    memberCharacters: [{ id: '5', name: 'Dark Lord Xu' }],
  },
  {
    id: '5',
    name: 'Dragon Claw Clan',
    type: 'Clan',
    hostility: 3,
    standingNotes: 'Tense relations, occasional disputes',
    memberCharacters: [{ id: '6', name: 'Clan Leader Long' }, { id: '7', name: 'Long Wei' }],
  },
  {
    id: '6',
    name: 'Star Void Sect',
    type: 'Sect',
    hostility: 2,
    standingNotes: 'Collaborative research partners',
    memberCharacters: [{ id: '8', name: 'Sage Moon' }],
  },
  {
    id: '7',
    name: 'Eternal Empire',
    type: 'Empire',
    hostility: 3,
    standingNotes: 'Political stability, occasional trade conflicts',
    memberCharacters: [{ id: '9', name: 'Emperor Qing' }, { id: '10', name: 'Minister Wu' }],
  },
  {
    id: '8',
    name: 'Eastern Sacred Peaks',
    type: 'Holy Land',
    hostility: 1,
    standingNotes: 'Shared cultivation resources, peaceful agreement',
    memberCharacters: [{ id: '11', name: 'Elder Daoist' }],
  },
];

const factionTypes = ['Clan', 'Sect', 'Holy Land', 'Evil Sect', 'Empire'] as const;

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  Clan: { bg: 'bg-blue-900/20', text: 'text-blue-300', border: 'border-blue-700' },
  Sect: { bg: 'bg-purple-900/20', text: 'text-purple-300', border: 'border-purple-700' },
  'Holy Land': { bg: 'bg-yellow-900/20', text: 'text-yellow-300', border: 'border-yellow-700' },
  'Evil Sect': { bg: 'bg-red-900/20', text: 'text-red-300', border: 'border-red-700' },
  Empire: { bg: 'bg-green-900/20', text: 'text-green-300', border: 'border-green-700' },
};

const HostilityIndicator: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted font-medium">Hostility:</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm ${
              i <= level ? 'bg-danger' : 'bg-surface-hover'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted ml-1">{level}/5</span>
    </div>
  );
};

const FactionCard: React.FC<{ faction: Faction; onClick: () => void }> = ({
  faction,
  onClick,
}) => {
  const colors = typeColors[faction.type];
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface border border-surface-hover rounded-lg p-4 hover:border-accent transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
          {faction.name}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {faction.type}
        </span>
      </div>

      <HostilityIndicator level={faction.hostility} />

      <p className="text-sm text-muted mt-2 mb-3 line-clamp-2">{faction.standingNotes}</p>

      <div className="flex flex-wrap gap-1">
        {faction.memberCharacters.slice(0, 3).map((char) => (
          <span
            key={char.id}
            className="text-xs bg-accent/10 text-accent px-2 py-1 rounded border border-accent/30"
          >
            {char.name}
          </span>
        ))}
        {faction.memberCharacters.length > 3 && (
          <span className="text-xs text-muted px-2 py-1">
            +{faction.memberCharacters.length - 3} more
          </span>
        )}
      </div>
    </button>
  );
};

const EditPanel: React.FC<{
  faction: Faction | null;
  onClose: () => void;
  onSave: (faction: Faction) => void;
}> = ({ faction, onClose, onSave }) => {
  const [editData, setEditData] = useState<Faction | null>(faction);

  // Sync editData when faction prop changes
  React.useEffect(() => {
    setEditData(faction);
  }, [faction]);

  if (!editData) return null;

  const handleSave = () => {
    onSave(editData);
    onClose();
  };

  const colors = typeColors[editData.type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-surface border border-surface-hover rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-surface-hover p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{editData.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type Badge */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Type</label>
            <select
              value={editData.type}
              onChange={(e) =>
                setEditData({ ...editData, type: e.target.value as Faction['type'] })
              }
              className="w-full px-3 py-2 bg-surface-hover text-foreground rounded-lg border border-surface-hover focus:border-accent outline-none transition-colors"
            >
              {factionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Faction Name */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Faction Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 bg-surface-hover text-foreground rounded-lg border border-surface-hover focus:border-accent outline-none transition-colors"
            />
          </div>

          {/* Hostility Level */}
          <div>
            <label className="block text-sm font-medium text-muted mb-3">Hostility Level</label>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setEditData({ ...editData, hostility: level as 1 | 2 | 3 | 4 | 5 })}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      editData.hostility === level
                        ? 'bg-danger text-white'
                        : 'bg-surface-hover text-muted hover:bg-surface-hover/80'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted">{editData.hostility}/5</span>
            </div>
          </div>

          {/* Standing Notes */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Standing Notes</label>
            <textarea
              value={editData.standingNotes}
              onChange={(e) => setEditData({ ...editData, standingNotes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-surface-hover text-foreground rounded-lg border border-surface-hover focus:border-accent outline-none transition-colors resize-none"
            />
          </div>

          {/* Member Characters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-muted">Member Characters</label>
              <button className="flex items-center gap-1 text-xs px-2 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors">
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {editData.memberCharacters.map((char) => (
                <div
                  key={char.id}
                  className="flex items-center justify-between px-3 py-2 bg-surface-hover rounded-lg"
                >
                  <span className="text-sm text-foreground">{char.name}</span>
                  <button className="p-1 hover:bg-surface rounded transition-colors">
                    <X size={14} className="text-muted" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-surface-hover p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-hover text-foreground rounded-lg hover:bg-surface-hover/80 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent-dark transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const FactionsScreen: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [factions, setFactions] = useState<Faction[]>(mockFactions);

  const handleSave = (updatedFaction: Faction) => {
    setFactions(factions.map((f) => (f.id === updatedFaction.id ? updatedFaction : f)));
  };

  const groupedFactions = factionTypes.reduce(
    (acc, type) => {
      acc[type] = factions.filter((f) => f.type === type);
      return acc;
    },
    {} as Record<string, Faction[]>
  );

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-surface-hover px-8 py-6">
        <h1 className="text-3xl font-bold text-foreground">Factions</h1>
        <p className="text-sm text-muted mt-1">Manage your world&apos;s political landscape</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="space-y-12 max-w-6xl mx-auto">
          {factionTypes.map((type) => {
            const typeFactions = groupedFactions[type];
            if (typeFactions.length === 0) return null;

            return (
              <div key={type}>
                {/* Section Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-1">{type}s</h2>
                  <div className="h-px bg-gradient-to-r from-accent to-transparent" />
                </div>

                {/* Faction Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeFactions.map((faction) => (
                    <FactionCard
                      key={faction.id}
                      faction={faction}
                      onClick={() => setSelectedFaction(faction)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Faction Button */}
      <div className="border-t border-surface-hover px-8 py-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent-dark transition-colors font-medium">
          <Plus size={18} /> Add New Faction
        </button>
      </div>

      {/* Edit Panel */}
      <EditPanel
        faction={selectedFaction}
        onClose={() => setSelectedFaction(null)}
        onSave={handleSave}
      />
    </div>
  );
};
