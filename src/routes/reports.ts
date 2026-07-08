import { Router } from "express";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";

const router = Router();

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const report = await prisma.consistencyReport.findUnique({
      where: { id: req.params.id as string },
      include: { findings: true, proposedStateChanges: true, chapter: true },
    });
    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }
    res.json(report);
  }),
);

// Applies a single proposed state change to the matching character record and
// logs it as a CharacterStateChange, closing the loop between "the model
// suggested this" and "the bible now reflects it". Left as an explicit,
// individually-approved action rather than auto-applied, since proposed
// changes carry a confidence level and are meant for human review first.
router.post(
  "/:reportId/proposed-changes/:changeId/apply",
  asyncHandler(async (req, res) => {
    const { reportId, changeId } = req.params as { reportId: string; changeId: string };

    const change = await prisma.proposedStateChange.findUnique({ where: { id: changeId } });
    if (!change || change.reportId !== reportId) {
      res.status(404).json({ error: "Proposed state change not found on this report" });
      return;
    }
    if (change.applied) {
      res.status(409).json({ error: "Proposed state change was already applied" });
      return;
    }

    const character = await prisma.character.findUnique({ where: { name: change.characterName } });
    if (!character) {
      res.status(400).json({
        error: `No character named "${change.characterName}" exists. Resolve the name manually before applying.`,
      });
      return;
    }

    const report = await prisma.consistencyReport.findUniqueOrThrow({
      where: { id: reportId },
      select: { chapterId: true },
    });

    const characterUpdate: { cultivationTierId?: string; factionId?: string; status?: string } = {};

    if (change.changeType === "realm_change") {
      const tier = await prisma.cultivationTier.findUnique({ where: { name: change.newValue } });
      if (!tier) {
        res.status(400).json({ error: `No cultivation tier named "${change.newValue}" exists.` });
        return;
      }
      characterUpdate.cultivationTierId = tier.id;
    } else if (change.changeType === "faction_change") {
      const faction = await prisma.faction.findUnique({ where: { name: change.newValue } });
      if (!faction) {
        res.status(400).json({ error: `No faction named "${change.newValue}" exists.` });
        return;
      }
      characterUpdate.factionId = faction.id;
    } else if (change.changeType === "status_change") {
      characterUpdate.status = change.newValue;
    }
    // relationship_change has no structured character field to update; it is
    // still logged below as CharacterStateChange history.

    const [, , stateChange] = await prisma.$transaction([
      Object.keys(characterUpdate).length
        ? prisma.character.update({ where: { id: character.id }, data: characterUpdate })
        : prisma.character.findUniqueOrThrow({ where: { id: character.id } }),
      prisma.proposedStateChange.update({
        where: { id: change.id },
        data: { applied: true, appliedAt: new Date() },
      }),
      prisma.characterStateChange.create({
        data: {
          characterId: character.id,
          changeType: change.changeType,
          oldValue: change.oldValue,
          newValue: change.newValue,
          evidenceQuote: change.evidenceQuote,
          chapterId: report.chapterId,
          proposedStateChangeId: change.id,
        },
      }),
    ]);

    res.json(stateChange);
  }),
);

export default router;
