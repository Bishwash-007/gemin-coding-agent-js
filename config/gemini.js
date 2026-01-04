import { GoogleGenAI } from "@google/genai";
import { ENV } from "./env.js";

if (!ENV.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set. Please check your .env file.");
}

export const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY,
});
