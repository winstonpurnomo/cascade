import { t } from "./helpers";
import { z } from "zod/v4";
import { describe, expect, it } from "vitest";
import { MockLanguageModelV1 } from "ai/test";

export const mockModel = (params: Record<string, any>) =>
  new MockLanguageModelV1({
    doGenerate: async ({ prompt, mode }) => {
      expect(prompt) === params["prompt"];
      expect(mode.type === "object-tool");
      return {
        rawCall: { rawPrompt: null, rawSettings: {} },
        finishReason: "stop",
        usage: { promptTokens: 10, completionTokens: 20 },
        text: `{
          "text": "The answer is 42"
        }`,
      };
    },
  });

describe("Agent", () => {
  it("should call the agent, and produce output of the correct shape", async () => {
    const agent = t.newAgent({
      id: "testAgent",
      input: z.string(),
      output: z.object({
        text: z.string(),
      }),
      inputTransformer: (input) => input,
      instructions: "Help the user",
      // We call expect inside the mock model to validate the prompt and mode
      llm: mockModel({ prompt: "What is the answer?" }),
      tools: [],
    });

    const out = await agent.call("What is the answer?", { env: "test" });
    expect(out).toEqual({ text: "The answer is 42" });
  });
});
