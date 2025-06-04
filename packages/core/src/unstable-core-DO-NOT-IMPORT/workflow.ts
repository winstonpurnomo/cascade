import { BaseContext } from "./index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { TStep, TStepArgs } from "./step.js";

export type TWorkflowArgs<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> = {
  id: string;
  input: TInput;
  output: TOutput;
};

type TBuiltState = boolean;

export class TWorkflow<
  TInput extends StandardSchemaV1,
  TCurrentOutput extends StandardSchemaV1 = TInput,
  TOutput extends StandardSchemaV1 = TCurrentOutput,
  TContext extends BaseContext = BaseContext,
  TBuilt extends TBuiltState = false,
> {
  private readonly steps: Array<TStepArgs<any, any, TContext>> = [];
  id: string;
  input: TInput;
  output: TOutput;

  constructor({ id, input, output }: TWorkflowArgs<TInput, TOutput, TContext>) {
    this.id = id;
    this.input = input;
    this.output = output;
    this.steps = [];
  }

  public addStep<TNextOutput extends StandardSchemaV1>(
    this: TWorkflow<TInput, TCurrentOutput, TOutput, TContext, false>,
    step: TStepArgs<TCurrentOutput, TNextOutput, TContext>,
  ): TWorkflow<TInput, TNextOutput, TOutput, TContext, false> {
    // Clone the current workflow and add the step
    const newWorkflow = new TWorkflow<
      TInput,
      TNextOutput,
      TOutput,
      TContext,
      false
    >({
      id: this.id,
      input: this.input,
      output: this.output,
    });
    // Copy existing steps
    newWorkflow.steps.push(...this.steps);
    // Add the new step
    newWorkflow.steps.push(step);
    return newWorkflow;
  }

  public build(
    this: TWorkflow<TInput, TOutput, TOutput, TContext, false>,
  ): TWorkflowExecutor<TInput, TOutput, TContext> {
    return new TWorkflowExecutor({
      id: this.id,
      input: this.input,
      output: this.output,
      steps: [...this.steps], // Create a fresh copy of steps
    });
  }
}

export class TWorkflowExecutor<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> {
  private readonly steps: Array<TStepArgs<any, any, TContext>>;
  readonly id: string;
  readonly input: TInput;
  readonly output: TOutput;

  constructor({
    id,
    input,
    output,
    steps,
  }: {
    id: string;
    input: TInput;
    output: TOutput;
    steps: Array<TStepArgs<any, any, TContext>>;
  }) {
    this.id = id;
    this.input = input;
    this.output = output;
    this.steps = steps;
  }

  public async call(
    args: StandardSchemaV1.InferInput<TInput>,
    context: TContext,
  ): Promise<StandardSchemaV1.InferOutput<TOutput>> {
    const input = args;
    let output = input;
    for (const step of this.steps) {
      output = await step.execute({ context, input: output });
    }
    return output;
  }
}
