import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";

const router = Router();

const CreateFactionSchema = z.object({
  name: z.string().min(1),
  summary: z.string().optional(),
});

const CreateRelationSchema = z.object({
  otherFactionId: z.string().min(1),
  standing: z.string().min(1),
  notes: z.string().optional(),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const factions = await prisma.faction.findMany();
    res.json(factions);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateFactionSchema.parse(req.body);
    const faction = await prisma.faction.create({ data: body });
    res.status(201).json(faction);
  }),
);

// Upserts the relation between :id and otherFactionId (order-independent).
router.put(
  "/:id/relations",
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const body = CreateRelationSchema.parse(req.body);
    const sorted = [id, body.otherFactionId].sort();
    const factionAId = sorted[0]!;
    const factionBId = sorted[1]!;

    const relation = await prisma.factionRelation.upsert({
      where: { factionAId_factionBId: { factionAId, factionBId } },
      create: { factionAId, factionBId, standing: body.standing, notes: body.notes },
      update: { standing: body.standing, notes: body.notes },
    });
    res.status(200).json(relation);
  }),
);

export default router;
