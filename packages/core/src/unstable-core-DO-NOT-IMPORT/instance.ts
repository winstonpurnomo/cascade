import { BaseContext } from "./index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";

type AgentInput =
  | string
  | {
      text: string;
      attachments: { imageUrl?: string; imageB64?: string; fileB64?: string }[];
    };

type TTool<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> = {
  id: string;
  input: TInput;
  output: TOutput;
  execute: ({
    context,
    input,
  }: {
    context: TContext;
    input: StandardSchemaV1.InferInput<TInput>;
  }) =>
    | Promise<StandardSchemaV1.InferOutput<TOutput>>
    | StandardSchemaV1.InferOutput<TOutput>;
};

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

  newTool<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>({
    id,
    input,
    output,
    execute,
  }: {
    id: string;
    input: TInput;
    output: TOutput;
    execute: ({
      context,
      input,
    }: {
      context: TContext;
      input: StandardSchemaV1.InferInput<TInput>;
    }) =>
      | Promise<StandardSchemaV1.InferOutput<TOutput>>
      | StandardSchemaV1.InferOutput<TOutput>;
  }) {
    return {
      id,
      input,
      output,
      execute,
    };
  }

  newAgent<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>({
    id,
    input,
    output,
    tools,
  }: {
    id: string;
    input: TInput;
    inputTransformer: (
      input: StandardSchemaV1.InferInput<TInput>,
    ) => Promise<AgentInput> | AgentInput;
    output: TOutput;
    tools?: TTool<any, any, any>[];
  }) {}
}
