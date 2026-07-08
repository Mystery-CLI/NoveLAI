import { CONTINUITY_CHECKER_INSTRUCTIONS } from "./instructions.js";

export interface HardRuleContext {
  text: string;
  characterName?: string | null;
}

export interface CultivationTierContext {
  name: string;
  orderIndex: number;
}

export interface StyleRuleContext {
  text: string;
}

export interface CharacterStateContext {
  name: string;
  realm: string | null;
  faction: string | null;
  status: string | null;
  characterRules: string[];
}

export interface FactionStandingContext {
  name: string;
  relations: { otherFaction: string; standing: string; notes?: string | null }[];
}

export interface ForeshadowContext {
  description: string;
  revealStatus: string;
  intendedReveal?: string | null;
  linkedCharacters: string[];
}

export interface PreviousChapterContext {
  number: number;
  endingStateNotes: string;
}

export interface PromptContext {
  hardRules: HardRuleContext[];
  cultivationTiers: CultivationTierContext[];
  styleRules: StyleRuleContext[];
  mentionedCharacters: CharacterStateContext[];
  mentionedFactionStandings: FactionStandingContext[];
  relevantForeshadowItems: ForeshadowContext[];
  previousChapter: PreviousChapterContext | null;
}

function buildBibleContextSection(ctx: PromptContext): string {
  const lines: string[] = ["# Bible Context"];

  lines.push(
    '\n## Hard Rules (always enforced; violations of these are severity "violation")',
  );
  if (ctx.hardRules.length === 0) {
    lines.push("(none defined)");
  } else {
    for (const rule of ctx.hardRules) {
      const scope = rule.characterName ? ` [scoped to ${rule.characterName}]` : "";
      lines.push(`- ${rule.text}${scope}`);
    }
  }

  lines.push("\n## Cultivation Tiers (ascending order)");
  if (ctx.cultivationTiers.length === 0) {
    lines.push("(none defined)");
  } else {
    const sorted = [...ctx.cultivationTiers].sort((a, b) => a.orderIndex - b.orderIndex);
    for (const tier of sorted) {
      lines.push(`- ${tier.orderIndex}. ${tier.name}`);
    }
  }

  lines.push("\n## Prose/Structural Style Rules");
  if (ctx.styleRules.length === 0) {
    lines.push("(none defined)");
  } else {
    for (const rule of ctx.styleRules) {
      lines.push(`- ${rule.text}`);
    }
  }

  if (ctx.mentionedCharacters.length > 0) {
    lines.push("\n## Current State of Characters Appearing In This Chapter");
    for (const character of ctx.mentionedCharacters) {
      lines.push(`\n### ${character.name}`);
      lines.push(`- Realm: ${character.realm ?? "unknown"}`);
      lines.push(`- Faction: ${character.faction ?? "unknown"}`);
      lines.push(`- Status: ${character.status ?? "unknown"}`);
      if (character.characterRules.length > 0) {
        lines.push("- Character-specific rules:");
        for (const rule of character.characterRules) {
          lines.push(`  - ${rule}`);
        }
      }
    }
  }

  if (ctx.mentionedFactionStandings.length > 0) {
    lines.push("\n## Standing/Hostility of Factions Appearing In This Chapter");
    for (const faction of ctx.mentionedFactionStandings) {
      lines.push(`\n### ${faction.name}`);
      if (faction.relations.length === 0) {
        lines.push("- (no recorded relations)");
      } else {
        for (const relation of faction.relations) {
          const notes = relation.notes ? ` — ${relation.notes}` : "";
          lines.push(`- vs ${relation.otherFaction}: ${relation.standing}${notes}`);
        }
      }
    }
  }

  if (ctx.relevantForeshadowItems.length > 0) {
    lines.push(
      "\n## Unresolved Foreshadowing Linked To Characters In This Chapter (not yet confirmed)",
    );
    for (const item of ctx.relevantForeshadowItems) {
      const linked = item.linkedCharacters.join(", ");
      const intended = item.intendedReveal ? ` Intended reveal: ${item.intendedReveal}` : "";
      lines.push(`- [${item.revealStatus}] (${linked}) ${item.description}${intended}`);
    }
  }

  if (ctx.previousChapter) {
    lines.push(
      `\n## Previous Chapter's Ending State (Chapter ${ctx.previousChapter.number})`,
    );
    lines.push(ctx.previousChapter.endingStateNotes);
  }

  return lines.join("\n");
}

export function buildSystemPrompt(ctx: PromptContext): string {
  return `${CONTINUITY_CHECKER_INSTRUCTIONS}\n\n${buildBibleContextSection(ctx)}`;
}
