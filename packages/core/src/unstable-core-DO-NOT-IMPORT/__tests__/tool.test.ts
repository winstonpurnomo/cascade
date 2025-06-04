import { describe, expect, it } from "vitest";
import { t } from "./helpers";
import { z } from "zod/v4";

describe("Tool", () => {
  it("should call the tool, and produce output of the correct shape", async () => {
    const tool = t.newTool({
      id: "testTool",
      input: z.string(),
      output: z.string(),
      execute: ({ context, input }) => {
        expect(input).toBe("Some string");
        expect(context.env).toBe("test");
        return `The answer is ${input}`;
      },
    });

    let out = tool.call("Some string", { env: "test" });
    if (out instanceof Promise) {
      out = await out;
    }

    expect(typeof out).toBe("string");
    expect(out).toBe("The answer is Some string");
  });
});
