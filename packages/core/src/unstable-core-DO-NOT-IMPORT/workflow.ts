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

export class TWorkflow<
  TInput extends StandardSchemaV1,
  TCurrentOutput extends StandardSchemaV1 = TInput,
  TOutput extends StandardSchemaV1 = TCurrentOutput,
  TContext extends BaseContext = BaseContext,
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
    step: TStepArgs<TCurrentOutput, TNextOutput, TContext>,
  ): TWorkflow<TInput, TNextOutput, TOutput, TContext> {
    // Clone the current workflow and add the step
    const newWorkflow = new TWorkflow<TInput, TNextOutput, TOutput, TContext>({
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

  /**
   * Finalise the workflow.
   * The special `this` parameter enforces at compile time that
   * `TCurrentOutput` and `TOutput` are the same.
   * If they differ, calling `.build()` will be a type error.
   */
  public build(
    this: TWorkflow<TInput, TOutput, TOutput, TContext>,
  ): TWorkflow<TInput, TOutput, TOutput, TContext> {
    return this;
  }
}
