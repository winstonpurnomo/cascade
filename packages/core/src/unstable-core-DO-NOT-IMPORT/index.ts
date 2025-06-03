import { CascadeInstance } from "./instance.js";

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

// Factory function
export function initCascade(): CascadeBuilder {
  return new CascadeBuilder();
}

export * from "./instance.js";
