import { TArgs } from "./args.js";
import { BaseContext } from "./index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";

export type TStepArgs<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> = TArgs<TInput, TOutput, TContext> & {
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

export class TStep<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> {
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

  constructor({
    id,
    input,
    output,
    execute,
  }: TStepArgs<TInput, TOutput, TContext>) {
    this.id = id;
    this.input = input;
    this.output = output;
    this.execute = execute;
  }

  call(input: StandardSchemaV1.InferInput<TInput>, context: TContext) {
    return this.execute({ context, input });
  }
}
