import { describe, it, expect } from 'vitest';
import { z } from 'zod/v4';
import { MockLanguageModelV1 } from 'ai/test';
import { t } from './helpers';

const mockModel = new MockLanguageModelV1({
  doGenerate: async () => {
    return {
      rawCall: { rawPrompt: null, rawSettings: {} },
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0 },
      text: '{"value": 4}',
    };
  },
});

describe('Workflow', () => {
  it('executes a workflow with tools and agents', async () => {
    const addOne = t.newTool({
      id: 'addOne',
      input: z.number(),
      output: z.number(),
      execute: ({ input }) => input + 1,
    });

    const agent = t.newAgent({
      id: 'double',
      input: z.number(),
      output: z.object({ value: z.number() }),
      inputTransformer: (n) => n.toString(),
      instructions: 'Double the number',
      llm: mockModel,
      tools: [],
    });

    const step1 = t.newStep({
      id: 'step1',
      input: z.number(),
      output: z.number(),
      execute: ({ input, context }) => addOne.call(input, context),
    });

    const step2 = t.newStep({
      id: 'step2',
      input: z.number(),
      output: z.object({ value: z.number() }),
      dependencies: [step1],
      execute: ({ input, context }) => agent.call(input, context),
    });

    const workflow = t
      .newWorkflow({ id: 'wf', input: z.number(), output: z.object({ value: z.number() }) })
      .addStep(step1)
      .addStep(step2)
      .build();

    const result = await workflow.call(1, { env: 'test' });
    expect(result).toEqual({ value: 4 });
  });
});
