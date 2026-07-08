// Detects which bible entities (characters, factions) are referenced in a
// chapter's text, so the prompt builder can decide what state to pull in.
// Deliberately simple (name/alias substring matching with word boundaries)
// rather than NER — the prompt calibration only needs "is this entity on
// page", not disambiguation of pronouns or indirect references.

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildNameRegex(name: string): RegExp {
  const escaped = escapeRegExp(name.trim());
  return new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, "iu");
}

export function isNameMentioned(content: string, name: string): boolean {
  if (!name.trim()) return false;
  return buildNameRegex(name).test(content);
}

export interface MentionableCharacter {
  id: string;
  name: string;
  aliases: string[];
}

export interface MentionableFaction {
  id: string;
  name: string;
}

export function findMentionedCharacters<T extends MentionableCharacter>(
  content: string,
  characters: T[],
): T[] {
  return characters.filter(
    (character) =>
      isNameMentioned(content, character.name) ||
      character.aliases.some((alias) => isNameMentioned(content, alias)),
  );
}

export function findMentionedFactions<T extends MentionableFaction>(
  content: string,
  factions: T[],
): T[] {
  return factions.filter((faction) => isNameMentioned(content, faction.name));
}
