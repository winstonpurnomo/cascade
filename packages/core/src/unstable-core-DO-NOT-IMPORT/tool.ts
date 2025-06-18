import { TArgs } from "./args.js";
import { BaseContext } from "./types.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { CascadeInstance } from "./instance.js";

export type TToolArgs<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
  TCascade extends CascadeInstance<TContext> = CascadeInstance<TContext>,
> = TArgs<TInput, TOutput, TContext> & {
  execute: ({
    context,
    input,
    cascade,
  }: {
    context: TContext;
    input: StandardSchemaV1.InferInput<TInput>;
    cascade: TCascade;
  }) =>
    | Promise<StandardSchemaV1.InferOutput<TOutput>>
    | StandardSchemaV1.InferOutput<TOutput>;
};

export class TTool<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
  TCascade extends CascadeInstance<TContext> = CascadeInstance<TContext>,
> {
  id: string;
  input: TInput;
  output: TOutput;
  execute: ({
    context,
    input,
    cascade,
  }: {
    context: TContext;
    input: StandardSchemaV1.InferInput<TInput>;
    cascade: TCascade;
  }) =>
    | Promise<StandardSchemaV1.InferOutput<TOutput>>
    | StandardSchemaV1.InferOutput<TOutput>;

  constructor({
    id,
    input,
    output,
    execute,
  }: TToolArgs<TInput, TOutput, TContext, TCascade>) {
    this.id = id;
    this.input = input;
    this.output = output;
    this.execute = execute;
  }

  call(
    input: StandardSchemaV1.InferInput<TInput>,
    context: TContext,
    cascade: TCascade,
  ) {
    return this.execute({ context, input, cascade });
  }
}
