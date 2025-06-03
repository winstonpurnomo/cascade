import express from "express";
import { initCascade } from "@cascade/core";
import * as cascadeExpress from "@cascade/core/adapters/express";
import * as v from "valibot";

type Context = {
  req: express.Request;
};

const t = initCascade().context<Context>().create();

const numConverter = t.newTool({
  id: "numConverter",
  input: v.string(),
  output: v.number(),
  execute: ({ context, input }) => {
    return Number.parseInt(input);
  },
});

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
      output: v.string(),
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
