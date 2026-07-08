import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";

const router = Router();

const CreateTierSchema = z.object({
  name: z.string().min(1),
  orderIndex: z.number().int(),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const tiers = await prisma.cultivationTier.findMany({ orderBy: { orderIndex: "asc" } });
    res.json(tiers);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateTierSchema.parse(req.body);
    const tier = await prisma.cultivationTier.create({ data: body });
    res.status(201).json(tier);
  }),
);

export default router;
