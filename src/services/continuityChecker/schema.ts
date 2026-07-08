import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";

const changeTypeValues = [
  "realm_change",
  "faction_change",
  "status_change",
  "relationship_change",
] as const;

const confidenceValues = ["high", "medium", "low"] as const;

const findingTypeValues = [
  "rule_violation",
  "state_contradiction",
  "tier_skip",
  "foreshadow_exposure",
  "continuity_break",
] as const;

const severityValues = ["violation", "warning", "info"] as const;

export const ProposedStateChangeSchema = z.object({
  character_name: z.string(),
  change_type: z.enum(changeTypeValues),
  old_value: z.string().optional(),
  new_value: z.string(),
  evidence_quote: z.string(),
  confidence: z.enum(confidenceValues),
});

export const FindingSchema = z.object({
  type: z.enum(findingTypeValues),
  severity: z.enum(severityValues),
  description: z.string(),
  evidence_quote: z.string(),
  related_rule_or_character: z.string().optional(),
  confidence: z.enum(confidenceValues),
});

export const ConsistencyReportSchema = z.object({
  proposed_state_changes: z.array(ProposedStateChangeSchema),
  findings: z.array(FindingSchema),
  insufficient_context: z.array(z.string()),
});

export type ConsistencyReportOutput = z.infer<typeof ConsistencyReportSchema>;

export const SUBMIT_CONSISTENCY_REPORT_TOOL: Anthropic.Tool = {
  name: "submit_consistency_report",
  description:
    "Submit the structured continuity-check report for this chapter. Must be called exactly once with the complete report.",
  input_schema: {
    type: "object",
    properties: {
      proposed_state_changes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            character_name: { type: "string" },
            change_type: { type: "string", enum: changeTypeValues },
            old_value: { type: "string" },
            new_value: { type: "string" },
            evidence_quote: { type: "string" },
            confidence: { type: "string", enum: confidenceValues },
          },
          required: [
            "character_name",
            "change_type",
            "new_value",
            "evidence_quote",
            "confidence",
          ],
        },
      },
      findings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: findingTypeValues },
            severity: { type: "string", enum: severityValues },
            description: { type: "string" },
            evidence_quote: { type: "string" },
            related_rule_or_character: { type: "string" },
            confidence: { type: "string", enum: confidenceValues },
          },
          required: [
            "type",
            "severity",
            "description",
            "evidence_quote",
            "confidence",
          ],
        },
      },
      insufficient_context: { type: "array", items: { type: "string" } },
    },
    required: ["proposed_state_changes", "findings", "insufficient_context"],
  },
};
