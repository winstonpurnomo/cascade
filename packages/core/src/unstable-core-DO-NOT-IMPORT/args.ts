import { BaseContext } from "./index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";

export type TArgs<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> = {
  id: string;
  input: TInput;
  output: TOutput;
  context?: TContext;
};
