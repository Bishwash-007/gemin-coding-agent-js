import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const readTool = {
  name: 'read_file',
  description: 'Read the contents of a file',
  parameters: zodToJsonSchema(z.object({
    path: z.string().describe('The path to the file to read'),
  })),
  execute: async ({ path: filePath }) => {
    try {
      const content = await fs.readFile(path.resolve(process.cwd(), filePath), 'utf-8');
      return content;
    } catch (error) {
      return `Error reading file: ${error.message}`;
    }
  },
};
