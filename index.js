import readline from "readline";
import { ai, modelId } from "./config/ai.js";
import { tools } from "./functions/index.js";
import { systemPrompt } from "./config/prompt.js";
import {
  showBanner,
  logAgent,
  logTool,
  logToolResult,
  logToolStreamStart,
  logToolStreamChunk,
  logError,
  logFollowUp,
} from "./utils/ui.js";
import ora from "ora";
import chalk from "chalk";

const toolDefinitions = Object.values(tools).map((tool) => ({
  type: "function",
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  },
}));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateContentWithRetry(params, retries = 3) {
  try {
    return await ai.chat(params);
  } catch (error) {
    const status = error?.response?.status || error?.status;
    const shouldRetry =
      status === 429 ||
      status === 503 ||
      (error?.message &&
        error.message.toLowerCase().includes("temporarily unavailable"));

    if (shouldRetry && retries > 0) {
      const waitTime = 2000 * (4 - retries);
      console.log(
        chalk.yellow(
          `\nOllama is busy. Retrying in ${waitTime / 1000} seconds... \nDetails: ${error.message}`,
        ),
      );
      await delay(waitTime);
      return generateContentWithRetry(params, retries - 1);
    }

    throw error;
  }
}

let history = [
  {
    role: "system",
    content: systemPrompt,
  },
];

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

showBanner();

rl.setPrompt(chalk.cyan.bold("❯ "));
rl.prompt();

const getToolCalls = (message) =>
  Array.isArray(message?.tool_calls) ? message.tool_calls : [];

const formatToolOutput = (value) => {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const parseToolArguments = (rawArgs, toolName) => {
  if (typeof rawArgs === "string") {
    if (!rawArgs.trim()) {
      return {};
    }

    try {
      return JSON.parse(rawArgs);
    } catch (error) {
      logError(
        `Failed to parse arguments for ${toolName}: ${error.message}. Raw payload: ${rawArgs}`,
      );
      return {};
    }
  }

  if (rawArgs && typeof rawArgs === "object") {
    return rawArgs;
  }

  return {};
};

const normalizeStreamEntries = (stream) =>
  stream.map((chunk, index) => {
    if (typeof chunk === "string") {
      return { line: index + 1, text: chunk };
    }

    return {
      line:
        typeof chunk?.line === "number" && Number.isFinite(chunk.line)
          ? chunk.line
          : index + 1,
      text: typeof chunk?.text === "string" ? chunk.text : "",
    };
  });

const handleToolOutput = (toolName, output) => {
  if (output && typeof output === "object") {
    const summary =
      typeof output.message === "string" ? output.message : undefined;
    const stream = Array.isArray(output.stream) ? output.stream : [];

    if (stream.length > 0) {
      const entries = normalizeStreamEntries(stream);
      const target = typeof output.path === "string" ? output.path : toolName;
      const message = summary || `Completed ${toolName}`;

      logToolResult(toolName, message);
      logToolStreamStart(target);
      entries.forEach(({ line, text }) => logToolStreamChunk(line, text));

      const codeBlock = entries.map(({ text }) => text).join("\n");
      return codeBlock
        ? `${message}\n${target}\n${codeBlock}`
        : `${message}\n${target}`;
    }

    if (summary) {
      const remaining = { ...output };
      delete remaining.message;
      delete remaining.path;
      delete remaining.stream;

      const extra = Object.keys(remaining).length
        ? formatToolOutput(remaining)
        : "";

      logToolResult(toolName, summary);
      return extra ? `${summary}\n${extra}` : summary;
    }

    const fallback = formatToolOutput(output);
    logToolResult(toolName, fallback);
    return fallback;
  }

  const rendered = formatToolOutput(output);
  logToolResult(toolName, rendered);
  return rendered;
};

const buildChatParams = () => {
  const params = {
    model: modelId,
    messages: history,
  };

  if (toolDefinitions.length > 0) {
    params.tools = toolDefinitions;
  }

  return params;
};

const normalizeMessage = (message) => {
  if (!message) {
    return { role: "assistant", content: "" };
  }

  const content = typeof message.content === "string" ? message.content : "";
  return { ...message, content };
};

rl.on("line", async (input) => {
  const trimmedInput = input.trim();
  const lowerInput = trimmedInput.toLowerCase();

  if (!trimmedInput) {
    logFollowUp("Let me know what you'd like to tackle next.");
    rl.prompt();
    return;
  }

  if (lowerInput === "exit" || lowerInput === "quit") {
    rl.close();
    return;
  }

  rl.pause();
  const spinner = ora("Thinking...").start();

  try {
    history.push({ role: "user", content: input });

    let response = await generateContentWithRetry(buildChatParams());
    let message = normalizeMessage(response?.message);
    let toolCalls = getToolCalls(message);

    while (toolCalls.length > 0) {
      history.push(message);

      spinner.text = `Calling tools: ${toolCalls
        .map((call) => call?.function?.name || "unknown")
        .join(", ")}`;

      for (const call of toolCalls) {
        const toolName = call?.function?.name;
        const tool = toolName ? tools[toolName] : undefined;
        const rawArgs = call?.function?.arguments ?? {};
        let parsedArgs = {};

        if (toolName && tool) {
          parsedArgs = parseToolArguments(rawArgs, toolName);

          spinner.stop();
          logTool(toolName);

          let output;
          try {
            output = await tool.execute(parsedArgs);
          } catch (toolError) {
            output = `Error executing tool ${toolName}: ${toolError.message || toolError}`;
          }
          const historyText = handleToolOutput(toolName, output) ?? "";
          history.push({
            role: "tool",
            content: historyText,
            tool_call_id: call.id,
          });

          spinner.start("Thinking...");
        } else {
          const missingMessage = `Tool ${toolName || "unknown"} not found when requested by model.`;
          const fallback =
            handleToolOutput(toolName || "unknown", missingMessage) ??
            missingMessage;
          history.push({
            role: "tool",
            content: fallback,
            tool_call_id: call?.id ?? "missing_tool",
          });
        }
      }

      response = await generateContentWithRetry(buildChatParams());
      message = normalizeMessage(response?.message);
      toolCalls = getToolCalls(message);
    }

    spinner.stop();

    const finalText = message.content || "No text response";
    const trimmed = finalText.trim();
    const hasQuestion = /\?\s*(?:$|\n)/m.test(trimmed);
    let finalOutput = finalText;

    if (hasQuestion) {
      logAgent(finalText);
    } else {
      const followUp = "What should we tackle next?";
      logAgent(finalText);
      logFollowUp(followUp);
      finalOutput = `${finalText.trimEnd()}\n\n${followUp}`;
    }

    history.push({ role: "assistant", content: finalOutput });
  } catch (error) {
    spinner.stop();
    logError(error.message || String(error));
  } finally {
    rl.resume();
    rl.prompt();
  }
});

rl.on("close", () => {
  console.log(chalk.dim("\nSession ended. See you next time!"));
  process.exit(0);
});
