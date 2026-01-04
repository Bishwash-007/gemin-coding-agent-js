import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const createTool = {
  name: 'create_directory',
  description: 'Create a new directory',
  parameters: zodToJsonSchema(z.object({
    path: z.string().describe('The path to the directory to create'),
  })),
  execute: async ({ path: dirPath }) => {
    try {
      await fs.mkdir(path.resolve(process.cwd(), dirPath), { recursive: true });
      return `Successfully created directory ${dirPath}`;
    } catch (error) {
      return `Error creating directory: ${error.message}`;
    }
  },
};
