import { BaseContext } from "./index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { TTool } from "./tool.js";
import type { LanguageModelV1 } from "@ai-sdk/provider";
import { generateObject, jsonSchema } from "ai";
import { toJsonSchema } from "@standard-community/standard-json";

type AgentInput =
  | string
  | {
      text: string;
      attachments: { imageUrl?: string; imageB64?: string; fileB64?: string }[];
    };

export type TAgentArgs<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
> = {
  id: string;
  input: TInput;
  inputTransformer: (
    input: StandardSchemaV1.InferInput<TInput>,
  ) => Promise<AgentInput> | AgentInput;
  instructions: string;
  output: TOutput;
  llm: LanguageModelV1;
  tools: TTool<any, any, any>[];
};

export class TAgent<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
  TContext extends BaseContext = BaseContext,
> {
  id: string;
  input: TInput;
  inputTransformer: (
    input: StandardSchemaV1.InferInput<TInput>,
  ) => Promise<AgentInput> | AgentInput;
  instructions: string;
  output: TOutput;
  llm: LanguageModelV1;
  tools: TTool<any, any, any>[];

  constructor({
    id,
    input,
    inputTransformer,
    instructions,
    output,
    llm,
    tools,
  }: TAgentArgs<TInput, TOutput>) {
    this.id = id;
    this.input = input;
    this.inputTransformer = inputTransformer;
    this.instructions = instructions;
    this.output = output;
    this.llm = llm;
    this.tools = tools;
  }

  async call(input: StandardSchemaV1.InferInput<TInput>, context: TContext) {
    const processedInput = await this.inputTransformer(input);
    // The AI SDK does not natively support Standard Schema, so we need to convert it to a JSON schema
    const schema = await toJsonSchema(this.output);
    const { object } = await generateObject({
      model: this.llm,
      prompt: "What is the answer?",
      messages: [
        {
          role: "user",
          content: JSON.stringify(processedInput),
        },
      ],
      schema: jsonSchema(schema),
    });
    let outputAsTypeSafe = this.output["~standard"].validate(object);
    if (outputAsTypeSafe instanceof Promise) {
      outputAsTypeSafe = await outputAsTypeSafe;
    }

    if (outputAsTypeSafe.issues) {
      throw new Error("Output validation failed");
    }

    return outputAsTypeSafe.value;
  }
}
