import { MockLanguageModelV1 } from "ai/test";
import { initCascade } from "../index.js";

type Context = {
  env: string;
};

export const t = initCascade().context<Context>().create();
