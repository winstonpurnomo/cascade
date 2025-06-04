// workflow.ts
import { BaseContext } from "./types.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { TStep, TStepArgs } from "./step.js";
import { TArgs } from "./args.js";
import { WorkflowContext } from "./workflow-context.js";

export type TWorkflowArgs<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> = TArgs<TInput, TOutput, TContext>;

type TBuiltState = boolean;

export class TWorkflow<
  TInput extends StandardSchemaV1,
  TCurrentOutput extends StandardSchemaV1 = TInput,
  TOutput extends StandardSchemaV1 = TCurrentOutput,
  TContext extends BaseContext = BaseContext,
  TBuilt extends TBuiltState = false,
> {
  private readonly steps: Array<TStep<any, any, TContext>> = [];
  private addedSteps: Set<string> = new Set();
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
    step: TStep<TCurrentOutput, TNextOutput, TContext>,
  ): TWorkflow<TInput, TNextOutput, TOutput, TContext, false> {
    // Validate dependencies are already added
    for (const dependency of step.dependencies) {
      if (!this.addedSteps.has(dependency.id)) {
        throw new Error(
          `Step "${step.id}" depends on "${dependency.id}" which hasn't been added to the workflow yet`,
        );
      }
    }

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

    // Copy existing steps and state
    newWorkflow.steps.push(...this.steps);
    newWorkflow.steps.push(step);
    newWorkflow.addedSteps = new Set([...this.addedSteps, step.id]);

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
  private readonly steps: Array<TStep<any, any, TContext>>;
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
    steps: Array<TStep<any, any, TContext>>;
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
    const workflowContext = new WorkflowContext();
    let output = args;

    for (const step of this.steps) {
      const stepOutput = await step.execute({
        context,
        input: output,
        workflowContext,
      });
      workflowContext.setStepOutput(step.id, stepOutput);
      output = stepOutput;
    }

    return output;
  }
}
