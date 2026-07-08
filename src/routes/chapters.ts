import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "./asyncHandler.js";
import { ChapterNotFoundError, runContinuityCheck } from "../services/continuityChecker/runCheck.js";

const router = Router();

const CreateChapterSchema = z.object({
  number: z.number().int().nonnegative(),
  title: z.string().optional(),
  content: z.string().min(1),
  endingStateNotes: z.string().optional(),
});

const UpdateChapterSchema = CreateChapterSchema.partial();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const chapters = await prisma.chapter.findMany({
      orderBy: { number: "asc" },
      select: { id: true, number: true, title: true, createdAt: true, updatedAt: true },
    });
    res.json(chapters);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const chapter = await prisma.chapter.findUnique({ where: { id: req.params.id as string } });
    if (!chapter) {
      res.status(404).json({ error: "Chapter not found" });
      return;
    }
    res.json(chapter);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = CreateChapterSchema.parse(req.body);
    const chapter = await prisma.chapter.create({ data: body });
    res.status(201).json(chapter);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = UpdateChapterSchema.parse(req.body);
    const chapter = await prisma.chapter.update({
      where: { id: req.params.id as string },
      data: body,
    });
    res.json(chapter);
  }),
);

router.get(
  "/:id/reports",
  asyncHandler(async (req, res) => {
    const reports = await prisma.consistencyReport.findMany({
      where: { chapterId: req.params.id as string },
      orderBy: { createdAt: "desc" },
      include: { findings: true, proposedStateChanges: true },
    });
    res.json(reports);
  }),
);

router.post(
  "/:id/check",
  asyncHandler(async (req, res) => {
    try {
      const report = await runContinuityCheck(req.params.id as string);
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof ChapterNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }),
);

export default router;
