import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};
