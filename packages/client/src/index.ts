import { CascadeInstance } from "@cascade/core/unstable-core-DO-NOT-IMPORT";
import {
  TAgent,
  TTool,
  TWorkflow,
} from "@cascade/core/unstable-core-DO-NOT-IMPORT";

// Extract the registry components from a CascadeInstance
type ExtractFromCascadeInstance<T> =
  T extends CascadeInstance<
    infer Context,
    infer Agents,
    infer Workflows,
    infer Tools
  >
    ? { agents: Agents; workflows: Workflows; tools: Tools }
    : never;

// Extract specific parts of the registry
type ExtractAgents<T> = T extends { agents: infer A } ? A : never;
type ExtractWorkflows<T> = T extends { workflows: infer W } ? W : never;
type ExtractTools<T> = T extends { tools: infer T } ? T : never;

export class CascadeClient<
  TInstance extends CascadeInstance<any, any, any, any>,
> {
  agents: ExtractAgents<ExtractFromCascadeInstance<TInstance>>;
  workflows: ExtractWorkflows<ExtractFromCascadeInstance<TInstance>>;
  tools: ExtractTools<ExtractFromCascadeInstance<TInstance>>;

  constructor() {
    // These will be populated by the actual implementation
    // For now, we'll cast them to satisfy TypeScript
    this.agents = {} as ExtractAgents<ExtractFromCascadeInstance<TInstance>>;
    this.workflows = {} as ExtractWorkflows<
      ExtractFromCascadeInstance<TInstance>
    >;
    this.tools = {} as ExtractTools<ExtractFromCascadeInstance<TInstance>>;
  }
}

// Factory function that creates a typed client
export function createCascadeClient<
  TInstance extends CascadeInstance<any, any, any, any>,
>(): CascadeClient<TInstance> {
  return new CascadeClient<TInstance>();
}
