// workflow-context.ts
import type { StandardSchemaV1 } from "@standard-schema/spec";

export class WorkflowContext {
  private outputs: Map<string, any> = new Map();

  setStepOutput<TOutput>(stepId: string, output: TOutput): void {
    this.outputs.set(stepId, output);
  }

  getStepOutput<TStep extends { id: string; output: StandardSchemaV1 }>(
    step: TStep,
  ): StandardSchemaV1.InferOutput<TStep["output"]> {
    const output = this.outputs.get(step.id);
    if (output === undefined) {
      throw new Error(`Step output for "${step.id}" not found`);
    }
    return output;
  }
}
