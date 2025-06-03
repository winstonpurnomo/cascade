import { BaseContext } from "./index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { TTool, TToolArgs } from "./tool.js";
import { TAgent, TAgentArgs } from "./agent.js";
import { TStep, TStepArgs } from "./step.js";
import { TWorkflow, TWorkflowArgs } from "./workflow.js";

export class CascadeInstance<TContext extends BaseContext = BaseContext> {
  instance: {
    agents: Record<string, any>;
    workflows: Record<string, any>;
    tools: Record<string, any>;
  };

  constructor() {
    this.instance = {
      agents: {},
      workflows: {},
      tools: {},
    };
  }

  registry({
    agents,
    workflows,
    tools,
  }: {
    agents: Record<string, any>;
    workflows: Record<string, any>;
    tools: Record<string, any>;
  }) {
    return;
  }

  newTool<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    args: TToolArgs<TInput, TOutput, TContext>,
  ) {
    return new TTool(args);
  }

  newAgent<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    args: TAgentArgs<TInput, TOutput>,
  ) {
    return new TAgent(args);
  }

  newStep<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    args: TStepArgs<TInput, TOutput, TContext>,
  ) {
    return new TStep(args);
  }

  newWorkflow<
    TInput extends StandardSchemaV1,
    TOutput extends StandardSchemaV1,
  >(args: TWorkflowArgs<TInput, TOutput, TContext>) {
    return new TWorkflow(args);
  }
}
