import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const deleteTool = {
  name: 'delete_file',
  description: 'Delete a file or directory',
  parameters: zodToJsonSchema(z.object({
    path: z.string().describe('The path to the file or directory to delete'),
  })),
  execute: async ({ path: filePath }) => {
    try {
      await fs.rm(path.resolve(process.cwd(), filePath), { recursive: true, force: true });
      return `Successfully deleted ${filePath}`;
    } catch (error) {
      return `Error deleting file: ${error.message}`;
    }
  },
};
