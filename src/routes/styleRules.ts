import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";

const router = Router();

const CreateStyleRuleSchema = z.object({ text: z.string().min(1) });

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rules = await prisma.styleRule.findMany();
    res.json(rules);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateStyleRuleSchema.parse(req.body);
    const rule = await prisma.styleRule.create({ data: body });
    res.status(201).json(rule);
  }),
);

export default router;
