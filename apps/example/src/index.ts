import express from "express";
import { initCascade } from "@cascade/core";
import * as cascadeExpress from "@cascade/core/adapters/express";

type Context = {
  req: express.Request;
};

const t = initCascade().context<Context>().create();

const registry = t.registry({
  agents: {},
  workflows: {},
  tools: {},
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
