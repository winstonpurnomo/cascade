import { BaseContext } from "./types.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { TTool, TToolArgs } from "./tool.js";
import { TAgent, TAgentArgs } from "./agent.js";
import { TStep, TStepArgs } from "./step.js";
import { TWorkflow, TWorkflowArgs } from "./workflow.js";

export class CascadeInstance<
  TContext extends BaseContext = BaseContext,
  TAgents extends { [K in keyof TAgents]: TAgent<any, any, TContext> } = {},
  TWorkflows extends {
    [K in keyof TWorkflows]: TWorkflow<any, any, any, TContext>
  } = {},
  TTools extends { [K in keyof TTools]: TTool<any, any, TContext> } = {},
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
    const TNewAgents extends {
      [K in keyof TNewAgents]: TAgent<any, any, TContext>
    },
    const TNewWorkflows extends {
      [K in keyof TNewWorkflows]: TWorkflow<any, any, any, TContext>
    },
    const TNewTools extends {
      [K in keyof TNewTools]: TTool<any, any, TContext>
    },
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
    this: CascadeInstance<TContext, TAgents, TWorkflows, TTools>,
    args: TToolArgs<
      TInput,
      TOutput,
      TContext,
      CascadeInstance<TContext, TAgents, TWorkflows, TTools>
    >,
  ) {
    const tool = new TTool(args);
    (this.instance.tools as any)[args.id] = tool;
    return tool;
  }

  newAgent<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    this: CascadeInstance<TContext, TAgents, TWorkflows, TTools>,
    args: TAgentArgs<TInput, TOutput, TContext>,
  ) {
    const agent = new TAgent<
      TInput,
      TOutput,
      TContext,
      CascadeInstance<TContext, TAgents, TWorkflows, TTools>
    >(args);
    (this.instance.agents as any)[args.id] = agent;
    return agent;
  }

  newStep<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    this: CascadeInstance<TContext, TAgents, TWorkflows, TTools>,
    args: TStepArgs<
      TInput,
      TOutput,
      TContext,
      CascadeInstance<TContext, TAgents, TWorkflows, TTools>
    >,
  ) {
    return new TStep(args);
  }

  newWorkflow<
    TInput extends StandardSchemaV1,
    TOutput extends StandardSchemaV1,
  >(this: CascadeInstance<TContext, TAgents, TWorkflows, TTools>, args: TWorkflowArgs<TInput, TOutput, TContext>) {
    const workflow = new TWorkflow<
      TInput,
      TInput,
      TOutput,
      TContext,
      CascadeInstance<TContext, TAgents, TWorkflows, TTools>
    >(args);
    (this.instance.workflows as any)[args.id] = workflow as any;
    return workflow;
  }
}
