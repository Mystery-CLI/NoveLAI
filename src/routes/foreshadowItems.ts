import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";

const router = Router();

const RevealStatusSchema = z.enum(["planted", "hinted", "partially_revealed", "confirmed"]);

const CreateForeshadowItemSchema = z.object({
  description: z.string().min(1),
  revealStatus: RevealStatusSchema.optional(),
  intendedReveal: z.string().optional(),
  characterIds: z.array(z.string()).default([]),
});

const UpdateForeshadowItemSchema = z.object({
  description: z.string().min(1).optional(),
  revealStatus: RevealStatusSchema.optional(),
  intendedReveal: z.string().optional(),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await prisma.foreshadowItem.findMany({
      include: { characters: { include: { character: { select: { id: true, name: true } } } } },
    });
    res.json(items);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateForeshadowItemSchema.parse(req.body);
    const item = await prisma.foreshadowItem.create({
      data: {
        description: body.description,
        revealStatus: body.revealStatus,
        intendedReveal: body.intendedReveal,
        characters: {
          create: body.characterIds.map((characterId) => ({ characterId })),
        },
      },
      include: { characters: { include: { character: { select: { id: true, name: true } } } } },
    });
    res.status(201).json(item);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = UpdateForeshadowItemSchema.parse(req.body);
    const item = await prisma.foreshadowItem.update({
      where: { id: req.params.id as string },
      data: body,
    });
    res.json(item);
  }),
);

export default router;
