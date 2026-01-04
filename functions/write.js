import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const writeTool = {
  name: 'write_file',
  description: 'Write content to a file. Overwrites existing content.',
  parameters: zodToJsonSchema(z.object({
    path: z.string().describe('The path to the file to write'),
    content: z.string().describe('The content to write to the file'),
  })),
  execute: async ({ path: filePath, content }) => {
    try {
      const fullPath = path.resolve(process.cwd(), filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, 'utf-8');
      return `Successfully wrote to ${filePath}`;
    } catch (error) {
      return `Error writing file: ${error.message}`;
    }
  },
};
