import express from "express";
import { initCascade } from "@cascade-ai/core";
import * as cascadeExpress from "@cascade-ai/core/adapters/express";
import { createCascadeClient } from "@cascade/client";
import * as v from "valibot";
import { google } from "@ai-sdk/google";

type Context = {
  env: string;
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
  dependencies: [firstStep],
  execute: ({ context: _, input, workflowContext }) => {
    const firstResult = workflowContext.getStepOutput(firstStep);
    return true;
  },
});

const myWorkflow = t
  .newWorkflow({
    id: "workflow",
    input: v.string(),
    output: v.boolean(),
  })
  .addStep(firstStep)
  .addStep(secondStep);

const newFirstStep = t.newStep({
  id: "firstStep2",
  input: v.string(),
  output: v.string(),
  execute: ({ context: _, input }) => {
    return input;
  },
});

const newSecondStep = t.newStep({
  id: "secondStep2",
  input: v.string(),
  output: v.string(),
  dependencies: [newFirstStep],
  execute: ({ context: _, input }) => {
    return input;
  },
});

const agent = t.newAgent({
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
});

const registry = t.registry({
  agents: {
    sayHello: agent,
  },
  workflows: {
    myWorkflow,
  },
  tools: {
    numConverter,
  },
});

type Registry = typeof registry;

registry.workflow("myWorkflow").build().call("1", {
  env: "DEV",
});

const app = express();

const createContext = ({
  req,
  res,
}: {
  req: express.Request;
  res: express.Response;
}) => ({
  env: process.env.NODE_ENV ?? "",
});

app.get(
  "/cascade",
  cascadeExpress.middleware({
    createContext: createContext,
    instance: t,
  }),
);

const client = createCascadeClient<Registry>();
const a = client.agents.sayHello;

const w = client.workflows; // autosuggestion for workflow names; type is { myWorkflow: TWorkflow<v.StringSchema<undefined>, v.BooleanSchema<undefined>, v.BooleanSchema<undefined>, Context, false>; }
