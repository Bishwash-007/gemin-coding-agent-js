import prettier from 'prettier';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const formatTool = {
  name: 'format_file',
  description: 'Format a file using Prettier',
  parameters: zodToJsonSchema(z.object({
    path: z.string().describe('The path to the file to format'),
  })),
  execute: async ({ path: filePath }) => {
    try {
      const fullPath = path.resolve(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      const formatted = await prettier.format(content, { filepath: fullPath });
      await fs.writeFile(fullPath, formatted, 'utf-8');
      return `Successfully formatted ${filePath}`;
    } catch (error) {
      return `Error formatting file: ${error.message}`;
    }
  },
};
