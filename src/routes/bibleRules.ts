import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";

const router = Router();

const CreateBibleRuleSchema = z.object({
  text: z.string().min(1),
  isHardRule: z.boolean().optional(),
  characterId: z.string().optional(),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rules = await prisma.bibleRule.findMany({ include: { character: true } });
    res.json(rules);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateBibleRuleSchema.parse(req.body);
    const rule = await prisma.bibleRule.create({ data: body });
    res.status(201).json(rule);
  }),
);

export default router;
