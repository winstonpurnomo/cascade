import { BaseContext } from "./types.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { TTool, TToolArgs } from "./tool.js";
import { TAgent, TAgentArgs } from "./agent.js";
import { TStep, TStepArgs } from "./step.js";
import { TWorkflow, TWorkflowArgs } from "./workflow.js";

export class CascadeInstance<
  TContext extends BaseContext = BaseContext,
  TAgents extends Record<string, TAgent<any, any, TContext>> = {},
  TWorkflows extends Record<string, TWorkflow<any, any, any, TContext>> = {},
  TTools extends Record<string, TTool<any, any, TContext>> = {},
> {
  instance: {
    agents: TAgents;
    workflows: TWorkflows;
    tools: TTools;
  };

  constructor() {
    this.instance = {
      agents: {} as TAgents,
      workflows: {} as TWorkflows,
      tools: {} as TTools,
    };
  }

  registry<
    const TNewAgents extends Record<string, TAgent<any, any, TContext>>,
    const TNewWorkflows extends Record<
      string,
      TWorkflow<any, any, any, TContext>
    >,
    const TNewTools extends Record<string, TTool<any, any, TContext>>,
  >(config: {
    agents: TNewAgents;
    workflows: TNewWorkflows;
    tools: TNewTools;
  }): CascadeInstance<TContext, TNewAgents, TNewWorkflows, TNewTools> {
    const newInstance = new CascadeInstance<
      TContext,
      TNewAgents,
      TNewWorkflows,
      TNewTools
    >();

    newInstance.instance.agents = config.agents;
    newInstance.instance.workflows = config.workflows;
    newInstance.instance.tools = config.tools;
    return newInstance;
  }

  // Type-safe workflow getter
  workflow<K extends keyof TWorkflows>(id: K): TWorkflows[K] {
    const workflow = this.instance.workflows[id];
    if (!workflow) {
      throw new Error(`Workflow with id "${String(id)}" not found`);
    }
    return workflow;
  }

  // Type-safe agent getter
  agent<K extends keyof TAgents>(id: K): TAgents[K] {
    const agent = this.instance.agents[id];
    if (!agent) {
      throw new Error(`Agent with id "${String(id)}" not found`);
    }
    return agent;
  }

  // Type-safe tool getter
  tool<K extends keyof TTools>(id: K): TTools[K] {
    const tool = this.instance.tools[id];
    if (!tool) {
      throw new Error(`Tool with id "${String(id)}" not found`);
    }
    return tool;
  }

  newTool<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    args: TToolArgs<TInput, TOutput, TContext>,
  ) {
    return new TTool(args);
  }

  newAgent<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    args: TAgentArgs<TInput, TOutput, TContext>,
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
