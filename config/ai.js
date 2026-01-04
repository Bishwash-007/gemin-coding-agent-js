import { Ollama } from "ollama";
import { ENV } from "./env.js";

export const ai = new Ollama({
  host: ENV.OLLAMA_HOST,
});

export const modelId = ENV.OLLAMA_MODEL;
