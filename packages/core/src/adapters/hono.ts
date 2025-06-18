import type { Context } from "hono";
import type { BaseContext, CascadeInstance } from "@cascade-ai/core";

export interface CreateContextOptions {
  c: Context;
}

export interface CascadeHonoOptions<TContext extends BaseContext> {
  createContext: (opts: CreateContextOptions) => TContext | Promise<TContext>;
  instance: CascadeInstance<TContext>;
}

export function middleware<TContext extends BaseContext>(
  options: CascadeHonoOptions<TContext>,
) {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      const context = await options.createContext({ c });
      c.set("cascadeContext", context);
      c.set("cascadeInstance", options.instance);
      await next();
    } catch (error) {
      console.error("Cascade middleware error:", error);
      c.status(500);
      c.json({ success: false, error: "Internal server error" });
    }
  };
}
