import { CascadeInstance } from "./instance.js";
import { BaseContext } from "./types.js";

export class CascadeBuilder<TContext extends BaseContext = BaseContext> {
  context<TNewContext extends BaseContext>(): CascadeBuilder<TNewContext> {
    return new CascadeBuilder<TNewContext>();
  }

  create(): CascadeInstance<TContext> {
    return new CascadeInstance<TContext>();
  }
}

// Factory function
export function initCascade(): CascadeBuilder {
  return new CascadeBuilder();
}

export { CascadeInstance } from "./instance.js";
export { TAgent } from "./agent.js";
export { TTool } from "./tool.js";
export { TStep } from "./step.js";
export { TWorkflow } from "./workflow.js";
export * from "./instance.js";
