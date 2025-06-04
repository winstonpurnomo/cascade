// step.ts
import { TArgs } from "./args.js";
import { BaseContext } from "./types.js";
import { WorkflowContext } from "./workflow-context.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";

export type TStepArgs<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> = TArgs<TInput, TOutput, TContext> & {
  dependencies?: ReadonlyArray<{ id: string; output: StandardSchemaV1 }>;
  execute: ({
    context,
    input,
    workflowContext,
  }: {
    context: TContext;
    input: StandardSchemaV1.InferInput<TInput>;
    workflowContext: WorkflowContext;
  }) =>
    | Promise<StandardSchemaV1.InferOutput<TOutput>>
    | StandardSchemaV1.InferOutput<TOutput>;
};

export class TStep<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> {
  id: string;
  input: TInput;
  output: TOutput;
  dependencies: ReadonlyArray<{ id: string; output: StandardSchemaV1 }>;
  execute: ({
    context,
    input,
    workflowContext,
  }: {
    context: TContext;
    input: StandardSchemaV1.InferInput<TInput>;
    workflowContext: WorkflowContext;
  }) =>
    | Promise<StandardSchemaV1.InferOutput<TOutput>>
    | StandardSchemaV1.InferOutput<TOutput>;

  constructor({
    id,
    input,
    output,
    dependencies = [],
    execute,
  }: TStepArgs<TInput, TOutput, TContext>) {
    this.id = id;
    this.input = input;
    this.output = output;
    this.dependencies = dependencies;
    this.execute = execute;
  }
}
