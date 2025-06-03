export interface BaseContext {
  [key: string]: any;
}

export class CascadeBuilder<TContext extends BaseContext = BaseContext> {
  context<TNewContext extends BaseContext>(): CascadeBuilder<TNewContext> {
    return new CascadeBuilder<TNewContext>();
  }

  create(): CascadeInstance<TContext> {
    return new CascadeInstance<TContext>();
  }
}

export class CascadeInstance<TContext extends BaseContext = BaseContext> {
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
}

// Factory function
export function initCascade(): CascadeBuilder {
  return new CascadeBuilder();
}
