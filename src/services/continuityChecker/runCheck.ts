import { prisma } from "../../db/client.js";
import { runConsistencyCheck } from "../anthropicClient.js";
import { findMentionedCharacters, findMentionedFactions } from "./mentionDetector.js";
import { buildSystemPrompt, type PromptContext } from "./promptBuilder.js";

export class ChapterNotFoundError extends Error {
  constructor(chapterId: string) {
    super(`Chapter not found: ${chapterId}`);
  }
}

async function gatherPromptContext(
  chapterId: string,
): Promise<{ content: string; context: PromptContext }> {
  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) throw new ChapterNotFoundError(chapterId);

  const [hardRules, cultivationTiers, styleRules, allCharacters, allFactions] =
    await Promise.all([
      prisma.bibleRule.findMany({
        where: { isHardRule: true },
        include: { character: { select: { name: true } } },
      }),
      prisma.cultivationTier.findMany({
        select: { name: true, orderIndex: true },
      }),
      prisma.styleRule.findMany({ select: { text: true } }),
      prisma.character.findMany({ select: { id: true, name: true, aliases: true } }),
      prisma.faction.findMany({ select: { id: true, name: true } }),
    ]);

  const previousChapterRow =
    chapter.number > 0
      ? await prisma.chapter.findUnique({
          where: { number: chapter.number - 1 },
          select: { number: true, endingStateNotes: true },
        })
      : null;

  const mentionedCharacterRefs = findMentionedCharacters(chapter.content, allCharacters);
  const mentionedCharacterIds = mentionedCharacterRefs.map((c) => c.id);

  const fullCharacters = mentionedCharacterIds.length
    ? await prisma.character.findMany({
        where: { id: { in: mentionedCharacterIds } },
        include: {
          cultivationTier: { select: { name: true } },
          faction: { select: { id: true, name: true } },
          bibleRules: { where: { isHardRule: false }, select: { text: true } },
        },
      })
    : [];

  const mentionedFactionsByName = findMentionedFactions(chapter.content, allFactions);
  const factionIdSet = new Set(mentionedFactionsByName.map((f) => f.id));
  for (const character of fullCharacters) {
    if (character.faction) factionIdSet.add(character.faction.id);
  }
  const mentionedFactionIds = [...factionIdSet];

  const factionRelations = mentionedFactionIds.length
    ? await prisma.factionRelation.findMany({
        where: {
          OR: [
            { factionAId: { in: mentionedFactionIds } },
            { factionBId: { in: mentionedFactionIds } },
          ],
        },
        include: {
          factionA: { select: { id: true, name: true } },
          factionB: { select: { id: true, name: true } },
        },
      })
    : [];

  const factionsById = new Map(allFactions.map((f) => [f.id, f]));
  for (const character of fullCharacters) {
    if (character.faction) factionsById.set(character.faction.id, character.faction);
  }

  const mentionedFactionStandings = mentionedFactionIds.map((factionId) => {
    const faction = factionsById.get(factionId);
    const relations = factionRelations
      .filter((r) => r.factionAId === factionId || r.factionBId === factionId)
      .map((r) => {
        const other = r.factionAId === factionId ? r.factionB : r.factionA;
        return { otherFaction: other.name, standing: r.standing, notes: r.notes };
      });
    return { name: faction?.name ?? "unknown faction", relations };
  });

  const relevantForeshadowItems = mentionedCharacterIds.length
    ? await prisma.foreshadowItem.findMany({
        where: {
          revealStatus: { not: "confirmed" },
          characters: { some: { characterId: { in: mentionedCharacterIds } } },
        },
        include: { characters: { include: { character: { select: { name: true } } } } },
      })
    : [];

  const context: PromptContext = {
    hardRules: hardRules.map((rule) => ({
      text: rule.text,
      characterName: rule.character?.name ?? null,
    })),
    cultivationTiers,
    styleRules,
    mentionedCharacters: fullCharacters.map((character) => ({
      name: character.name,
      realm: character.cultivationTier?.name ?? null,
      faction: character.faction?.name ?? null,
      status: character.status,
      characterRules: character.bibleRules.map((r) => r.text),
    })),
    mentionedFactionStandings,
    relevantForeshadowItems: relevantForeshadowItems.map((item) => ({
      description: item.description,
      revealStatus: item.revealStatus,
      intendedReveal: item.intendedReveal,
      linkedCharacters: item.characters.map((link) => link.character.name),
    })),
    previousChapter: previousChapterRow?.endingStateNotes
      ? { number: previousChapterRow.number, endingStateNotes: previousChapterRow.endingStateNotes }
      : null,
  };

  return { content: chapter.content, context };
}

export async function runContinuityCheck(chapterId: string) {
  const { content, context } = await gatherPromptContext(chapterId);
  const systemPrompt = buildSystemPrompt(context);
  const result = await runConsistencyCheck(systemPrompt, content);

  return prisma.consistencyReport.create({
    data: {
      chapterId,
      insufficientContext: result.insufficient_context,
      rawResponse: result,
      findings: {
        create: result.findings.map((finding) => ({
          type: finding.type,
          severity: finding.severity,
          description: finding.description,
          evidenceQuote: finding.evidence_quote,
          relatedRuleOrCharacter: finding.related_rule_or_character,
          confidence: finding.confidence,
        })),
      },
      proposedStateChanges: {
        create: result.proposed_state_changes.map((change) => ({
          characterName: change.character_name,
          changeType: change.change_type,
          oldValue: change.old_value,
          newValue: change.new_value,
          evidenceQuote: change.evidence_quote,
          confidence: change.confidence,
        })),
      },
    },
    include: { findings: true, proposedStateChanges: true },
  });
}
