import { describe, it, expectTypeOf } from 'vitest';
import { z } from 'zod/v4';
import { t } from './helpers';

// This test only checks compile-time type inference for the registry

describe('CascadeInstance.registry', () => {
  it('preserves registered keys in the returned instance type', () => {
    const tool = t.newTool({
      id: 'tool1',
      input: z.number(),
      output: z.number(),
      execute: ({ input }) => input,
    });

    const agent = t.newAgent({
      id: 'agent1',
      input: z.number(),
      output: z.number(),
      inputTransformer: (n) => n.toString(),
      instructions: '',
      llm: {} as any,
      tools: [],
    });

    const registry = t.registry({
      agents: { agent1: agent },
      workflows: {},
      tools: { tool1: tool },
    });

    // The registry should expose the specific keys we registered
    expectTypeOf(registry.tools).toMatchTypeOf<{ tool1: any }>();
    expectTypeOf(registry.agents).toMatchTypeOf<{ agent1: any }>();
  });
});
