import Anthropic from "@anthropic-ai/sdk";
import {
  ConsistencyReportSchema,
  SUBMIT_CONSISTENCY_REPORT_TOOL,
  type ConsistencyReportOutput,
} from "./continuityChecker/schema.js";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

const DEFAULT_MODEL = "claude-sonnet-5";

export async function runConsistencyCheck(
  systemPrompt: string,
  chapterContent: string,
): Promise<ConsistencyReportOutput> {
  const response = await getClient().messages.create({
    model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: chapterContent }],
    tools: [SUBMIT_CONSISTENCY_REPORT_TOOL],
    tool_choice: { type: "tool", name: "submit_consistency_report" },
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) {
    throw new Error("Model response did not include a submit_consistency_report tool call");
  }

  return ConsistencyReportSchema.parse(toolUse.input);
}
