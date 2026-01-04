import { execa } from "execa";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const shellTool = {
  name: "run_shell",
  description: "Run a shell command",
  parameters: zodToJsonSchema(
    z.object({
      command: z.string().describe("The shell command to run"),
    })
  ),
  execute: async ({ command }) => {
    try {
      const { stdout, stderr } = await execa(command, { shell: true });
      return stdout || stderr;
    } catch (error) {
      return `Error running command: ${error.message}`;
    }
  },
};
