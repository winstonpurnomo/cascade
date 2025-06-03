import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { CascadeInstance, BaseContext } from "@cascade/core";

export interface CreateContextOptions {
  req: Request;
  res: Response;
}

export interface CascadeExpressOptions<TContext extends BaseContext> {
  createContext: (opts: CreateContextOptions) => TContext | Promise<TContext>;
  instance: CascadeInstance<TContext>;
}

export function middleware<TContext extends BaseContext>(
  options: CascadeExpressOptions<TContext>,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create context using the provided factory
      const context = await options.createContext({ req, res });

      // Store context in locals for later use
      res.locals.cascadeContext = context;
      res.locals.cascadeInstance = options.instance;

      // For now, just respond with success
      // Later you can add routing logic here
      res.json({
        success: true,
        message: "Cascade middleware initialized",
        hasContext: !!context,
      });
    } catch (error) {
      console.error("Cascade middleware error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
}
