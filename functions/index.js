import { readTool } from './read.js';
import { writeTool } from './write.js';
import { createTool } from './create.js';
import { deleteTool } from './delete.js';
import { shellTool } from './shell.js';
import { diffTool } from './diff.js';
import { formatTool } from './format.js';

export const tools = {
  [readTool.name]: readTool,
  [writeTool.name]: writeTool,
  [createTool.name]: createTool,
  [deleteTool.name]: deleteTool,
  [shellTool.name]: shellTool,
  [diffTool.name]: diffTool,
  [formatTool.name]: formatTool,
};
