import { diffLines } from 'diff';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const diffTool = {
  name: 'diff_files',
  description: 'Show the difference between two files',
  parameters: zodToJsonSchema(z.object({
    path1: z.string().describe('The path to the first file'),
    path2: z.string().describe('The path to the second file'),
  })),
  execute: async ({ path1, path2 }) => {
    try {
      const content1 = await fs.readFile(path.resolve(process.cwd(), path1), 'utf-8');
      const content2 = await fs.readFile(path.resolve(process.cwd(), path2), 'utf-8');
      const changes = diffLines(content1, content2);
      
      let diffOutput = '';
      changes.forEach((part) => {
        const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
        // Handle newlines correctly to prefix each line
        diffOutput += part.value.split('\n').filter(l => l).map(line => `${prefix}${line}`).join('\n') + '\n';
      });
      return diffOutput;
    } catch (error) {
      return `Error diffing files: ${error.message}`;
    }
  },
};
