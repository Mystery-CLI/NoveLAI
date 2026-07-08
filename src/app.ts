import express, { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import cultivationTiersRouter from "./routes/cultivationTiers.js";
import factionsRouter from "./routes/factions.js";
import charactersRouter from "./routes/characters.js";
import bibleRulesRouter from "./routes/bibleRules.js";
import styleRulesRouter from "./routes/styleRules.js";
import foreshadowItemsRouter from "./routes/foreshadowItems.js";
import chaptersRouter from "./routes/chapters.js";
import reportsRouter from "./routes/reports.js";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/cultivation-tiers", cultivationTiersRouter);
  app.use("/factions", factionsRouter);
  app.use("/characters", charactersRouter);
  app.use("/bible-rules", bibleRulesRouter);
  app.use("/style-rules", styleRulesRouter);
  app.use("/foreshadow-items", foreshadowItemsRouter);
  app.use("/chapters", chaptersRouter);
  app.use("/reports", reportsRouter);

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
      res.status(400).json({ error: "Invalid request body", details: err.issues });
      return;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(409).json({ error: "Unique constraint violation", meta: err.meta });
        return;
      }
      if (err.code === "P2025") {
        res.status(404).json({ error: "Record not found" });
        return;
      }
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  };
  app.use(errorHandler);

  return app;
}
