import express from "express";
import { initCascade } from "@cascade/core";
import * as cascadeExpress from "@cascade/core/adapters/express";
import * as v from "valibot";
import { google } from "@ai-sdk/google";

type Context = {
  req: express.Request;
};

const t = initCascade().context<Context>().create();

const numConverter = t.newTool({
  id: "numConverter",
  input: v.string(),
  output: v.number(),
  execute: ({ context: _, input }) => {
    return Number.parseInt(input);
  },
});

const firstStep = t.newStep({
  id: "firstStep",
  input: v.string(),
  output: v.number(),
  execute: ({ context: _, input }) => {
    return 1;
  },
});

const secondStep = t.newStep({
  id: "secondStep",
  input: v.number(),
  output: v.boolean(),
  execute: ({ context: _, input }) => {
    return true;
  },
});

const workflow = t
  .newWorkflow({
    id: "workflow",
    input: v.string(),
    output: v.number(),
  })
  .addStep(firstStep)
  .addStep(secondStep);

const registry = t.registry({
  agents: {
    sayHello: t.newAgent({
      id: "sayHello",
      input: v.object({
        name: v.string(),
      }),
      inputTransformer(x) {
        return x.name;
      },
      instructions: "Say hello to the user",
      output: v.string(),
      llm: google("gemini-2.0-flash"),
      tools: [numConverter],
    }),
  },
  workflows: {},
  tools: {
    numConverter,
  },
});

const app = express();

const createContext = ({
  req,
  res,
}: {
  req: express.Request;
  res: express.Response;
}) => ({
  req,
});

app.get(
  "/cascade",
  cascadeExpress.middleware({
    createContext: createContext,
    instance: t,
  }),
);
