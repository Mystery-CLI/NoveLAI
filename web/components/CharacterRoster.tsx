'use client';

import { useState } from 'react';
import { X, Edit2, Check, ChevronDown } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  avatar?: string;
  role: 'MC' | 'Supporting' | 'Antagonist' | 'Disposable';
  realmTier: string;
  faction: string;
  status: 'Alive' | 'Dead' | 'Unknown' | 'Ambiguous';
  bio: string;
  personality: string;
  codeRules: string[];
  history: Array<{
    chapter: number;
    date: string;
    change: string;
    oldValue: string;
    newValue: string;
  }>;
}

const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Li Wei',
    role: 'MC',
    realmTier: 'Core Formation',
    faction: 'Jade Sect',
    status: 'Alive',
    bio: 'A rogue cultivator seeking the immortal path. Talented but lacks proper guidance.',
    personality: 'Determined, impulsive, compassionate to allies',
    codeRules: ['Always acts with honor', 'Protects the weak', 'Questions authority'],
    history: [
      { chapter: 5, date: '2024-01-15', change: 'Realm change', oldValue: 'Foundation Establishment', newValue: 'Core Formation' },
      { chapter: 3, date: '2024-01-10', change: 'Status update', oldValue: 'Unknown', newValue: 'Alive' },
    ],
  },
  {
    id: '2',
    name: 'Zhan Hu',
    role: 'Supporting',
    realmTier: 'Nascent Soul',
    faction: 'Demon Beast Clan',
    status: 'Alive',
    bio: 'An ancient demon beast companion. Mysterious origins and hidden powers.',
    personality: 'Loyal, wise, often cryptic',
    codeRules: ['Never betrays allies', 'Speaks in riddles', 'Avoids direct combat'],
    history: [
      { chapter: 12, date: '2024-01-20', change: 'Status update', oldValue: 'Unknown', newValue: 'Alive' },
    ],
  },
  {
    id: '3',
    name: 'Elder Qin',
    role: 'Antagonist',
    realmTier: 'Immortal Ascension',
    faction: 'Heavenly Sword Sect',
    status: 'Alive',
    bio: 'The sect master who seeks to maintain the old order. Powerful and ruthless.',
    personality: 'Authoritative, proud, calculating',
    codeRules: ['Follows tradition above all', 'Eliminates threats methodically', 'Values power over morality'],
    history: [
      { chapter: 1, date: '2024-01-01', change: 'Faction change', oldValue: 'Unaffiliated', newValue: 'Heavenly Sword Sect' },
    ],
  },
  {
    id: '4',
    name: 'Sha Ling',
    role: 'Antagonist',
    realmTier: 'Tribulation Transcendence',
    faction: 'Demon Court',
    status: 'Dead',
    bio: 'A fallen celestial being corrupted by dark energy. Defeated in the climax.',
    personality: 'Cruel, power-hungry, obsessed with domination',
    codeRules: ['Consumes lesser beings', 'Never shows mercy', 'Seeks immortality at any cost'],
    history: [
      { chapter: 42, date: '2024-02-15', change: 'Status update', oldValue: 'Alive', newValue: 'Dead' },
    ],
  },
  {
    id: '5',
    name: 'Meng Yao',
    role: 'Supporting',
    realmTier: 'Golden Immortal',
    faction: 'Jade Sect',
    status: 'Ambiguous',
    bio: 'A mysterious cultivator whose true allegiances remain unclear.',
    personality: 'Enigmatic, helpful but secretive, philosophical',
    codeRules: ['Helps only when asked', 'Keeps true intentions hidden', 'Speaks in abstractions'],
    history: [
      { chapter: 8, date: '2024-01-12', change: 'Status update', oldValue: 'Unknown', newValue: 'Ambiguous' },
    ],
  },
  {
    id: '6',
    name: 'Tang Jun',
    role: 'Disposable',
    realmTier: 'Qi Condensation',
    faction: 'Unaffiliated',
    status: 'Dead',
    bio: 'A minor cultivator who served as a sacrifice to the greater narrative.',
    personality: 'Eager, naive, well-intentioned',
    codeRules: ['Follows orders without question', 'Lacks agency', 'Exists for others\' purposes'],
    history: [
      { chapter: 15, date: '2024-01-25', change: 'Status update', oldValue: 'Alive', newValue: 'Dead' },
    ],
  },
];

export function CharacterRoster() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const selectedCharacter = mockCharacters.find(c => c.id === selectedCharacterId);

  return (
    <div className="flex h-full gap-4 p-6 bg-background overflow-hidden">
      {/* Character Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Character Roster</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCharacters.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacterId(character.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedCharacterId === character.id
                  ? 'border-accent bg-surface-hover'
                  : 'border-surface-hover bg-surface hover:border-accent hover:bg-surface-hover'
              }`}
            >
              {/* Avatar Placeholder */}
              <div className="w-16 h-16 rounded-lg bg-surface-hover mb-3 flex items-center justify-center text-2xl">
                {character.name.charAt(0)}
              </div>

              {/* Character Info */}
              <h3 className="font-bold text-foreground mb-2">{character.name}</h3>

              {/* Role Badge */}
              <div className="mb-3">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    character.role === 'MC'
                      ? 'bg-accent text-background'
                      : character.role === 'Supporting'
                      ? 'bg-info text-foreground'
                      : character.role === 'Antagonist'
                      ? 'bg-danger text-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {character.role}
                </span>
              </div>

              {/* Realm Tier */}
              <div className="text-sm text-muted mb-2">
                <span className="font-semibold text-accent">{character.realmTier}</span>
              </div>

              {/* Faction */}
              <div className="text-xs text-muted mb-3 line-clamp-1">
                {character.faction}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    character.status === 'Alive'
                      ? 'bg-success text-background'
                      : character.status === 'Dead'
                      ? 'bg-danger text-foreground'
                      : character.status === 'Unknown'
                      ? 'bg-muted text-foreground'
                      : 'bg-warning text-background'
                  }`}
                >
                  {character.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedCharacter && (
        <div className="w-80 bg-surface rounded-lg border border-surface-hover overflow-y-auto flex flex-col">
          <CharacterDetailPanel character={selectedCharacter} onClose={() => setSelectedCharacterId(null)} />
        </div>
      )}
    </div>
  );
}

function CharacterDetailPanel({
  character,
  onClose,
}: {
  character: Character;
  onClose: () => void;
}) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [realmTier, setRealmTier] = useState(character.realmTier);
  const [faction, setFaction] = useState(character.faction);
  const [status, setStatus] = useState(character.status);

  const handleSave = (field: string, value: string) => {
    if (field === 'realmTier') setRealmTier(value);
    if (field === 'faction') setFaction(value);
    if (field === 'status') setStatus(value);
    setEditingField(null);
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-surface-hover flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{character.name}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-surface-hover rounded transition-colors"
          aria-label="Close panel"
        >
          <X size={20} className="text-muted" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Bio */}
        <div>
          <h3 className="text-sm font-semibold text-muted mb-2">Bio</h3>
          <p className="text-sm text-foreground leading-relaxed">{character.bio}</p>
        </div>

        {/* Personality */}
        <div>
          <h3 className="text-sm font-semibold text-muted mb-2">Personality</h3>
          <p className="text-sm text-foreground leading-relaxed">{character.personality}</p>
        </div>

        {/* Code Rules */}
        <div>
          <h3 className="text-sm font-semibold text-muted mb-2">Character Code Rules</h3>
          <div className="space-y-1">
            {character.codeRules.map((rule, idx) => (
              <div key={idx} className="text-sm text-foreground bg-surface-hover rounded px-2 py-1">
                • {rule}
              </div>
            ))}
          </div>
        </div>

        {/* Editable Dropdowns */}
        <div className="space-y-3 border-t border-surface-hover pt-3">
          {/* Realm Tier */}
          <EditableDropdown
            label="Realm Tier"
            value={realmTier}
            options={['Qi Condensation', 'Foundation Establishment', 'Core Formation', 'Nascent Soul', 'Golden Immortal', 'Tribulation Transcendence', 'Immortal Ascension']}
            onSave={(value) => handleSave('realmTier', value)}
            isEditing={editingField === 'realmTier'}
            onEdit={() => setEditingField('realmTier')}
          />

          {/* Faction */}
          <EditableDropdown
            label="Faction"
            value={faction}
            options={['Jade Sect', 'Heavenly Sword Sect', 'Demon Beast Clan', 'Demon Court', 'Unaffiliated', 'Neutral']}
            onSave={(value) => handleSave('faction', value)}
            isEditing={editingField === 'faction'}
            onEdit={() => setEditingField('faction')}
          />

          {/* Status */}
          <EditableDropdown
            label="Status"
            value={status}
            options={['Alive', 'Dead', 'Unknown', 'Ambiguous']}
            onSave={(value) => handleSave('status', value)}
            isEditing={editingField === 'status'}
            onEdit={() => setEditingField('status')}
          />
        </div>

        {/* History Log */}
        <div className="border-t border-surface-hover pt-3">
          <h3 className="text-sm font-semibold text-muted mb-2">State Change History</h3>
          <div className="space-y-2 text-xs">
            {character.history.length > 0 ? (
              character.history.map((entry, idx) => (
                <div key={idx} className="p-2 bg-surface-hover rounded">
                  <div className="text-accent font-semibold">Ch. {entry.chapter}</div>
                  <div className="text-muted">{entry.change}</div>
                  <div className="text-foreground">
                    {entry.oldValue} → {entry.newValue}
                  </div>
                  <div className="text-muted text-xs mt-1">{entry.date}</div>
                </div>
              ))
            ) : (
              <p className="text-muted italic">No history yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function EditableDropdown({
  label,
  value,
  options,
  onSave,
  isEditing,
  onEdit,
}: {
  label: string;
  value: string;
  options: string[];
  onSave: (value: string) => void;
  isEditing: boolean;
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-muted">{label}</label>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="p-0.5 hover:bg-surface-hover rounded transition-colors"
            aria-label={`Edit ${label}`}
          >
            <Edit2 size={14} className="text-accent" />
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="flex gap-1">
          <select
            value={value}
            onChange={(e) => onSave(e.target.value)}
            className="flex-1 bg-surface-hover text-foreground text-sm rounded px-2 py-1 border border-accent"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            onClick={() => onSave(value)}
            className="p-1 hover:bg-surface-hover rounded transition-colors"
            aria-label="Save"
          >
            <Check size={16} className="text-success" />
          </button>
        </div>
      ) : (
        <div className="bg-surface-hover text-foreground text-sm rounded px-2 py-1">
          {value}
        </div>
      )}
    </div>
  );
}
