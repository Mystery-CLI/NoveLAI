import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";

const router = Router();

const CreateCharacterSchema = z.object({
  name: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  cultivationTierId: z.string().optional(),
  factionId: z.string().optional(),
});

const UpdateCharacterSchema = CreateCharacterSchema.partial();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const characters = await prisma.character.findMany({
      include: { cultivationTier: true, faction: true },
    });
    res.json(characters);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const character = await prisma.character.findUnique({
      where: { id: req.params.id as string },
      include: {
        cultivationTier: true,
        faction: true,
        bibleRules: true,
        stateChanges: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }
    res.json(character);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateCharacterSchema.parse(req.body);
    const character = await prisma.character.create({ data: body });
    res.status(201).json(character);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = UpdateCharacterSchema.parse(req.body);
    const character = await prisma.character.update({
      where: { id: req.params.id as string },
      data: body,
    });
    res.json(character);
  }),
);

export default router;
