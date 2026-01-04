import readline from "readline";
import { ai } from "./config/gemini.js";
import { tools } from "./functions/index.js";
import { systemPrompt } from "./config/prompt.js";
import {
  showBanner,
  logAgent,
  logTool,
  logError,
  logFollowUp,
} from "./utils/ui.js";
import ora from "ora";
import chalk from "chalk";

const toolDeclarations = Object.values(tools).map((tool) => ({
  name: tool.name,
  description: tool.description,
  parameters: tool.parameters,
}));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const modelId = "gemini-2.5-flash";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateContentWithRetry(params, retries = 3) {
  try {
    return await ai.models.generateContent(params);
  } catch (error) {
    if (
      error.status === 429 ||
      error.code === 429 ||
      (error.message &&
        (error.message.includes("429") || error.message.includes("quota")))
    ) {
      if (retries > 0) {
        const waitTime = 4000 * (4 - retries);
        console.log(
          chalk.yellow(
            `\nRate limit exceeded. Retrying in ${waitTime / 1000} seconds... \nDetails: ${error.message}`,
          ),
        );
        await delay(waitTime);
        return generateContentWithRetry(params, retries - 1);
      }
    }
    throw error;
  }
}

let history = [
  {
    role: "user",
    parts: [{ text: systemPrompt }],
  },
];

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

showBanner();

rl.setPrompt(chalk.cyan.bold("❯ "));
rl.prompt();

const getFunctionCalls = (resp) => {
  const candidate = resp.candidates?.[0];
  return (
    candidate?.content?.parts
      ?.filter((p) => p.functionCall)
      ?.map((p) => p.functionCall) || []
  );
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
    history.push({ role: "user", parts: [{ text: input }] });

    let response = await generateContentWithRetry({
      model: modelId,
      contents: history,
      config: {
        tools: [{ functionDeclarations: toolDeclarations }],
      },
    });

    let functionCalls = getFunctionCalls(response);

    while (functionCalls.length > 0) {
      const candidate = response.candidates[0];
      history.push(candidate.content);

      spinner.text = `Calling tools: ${functionCalls
        .map((c) => c.name)
        .join(", ")}`;

      const toolResponses = [];
      for (const call of functionCalls) {
        const tool = tools[call.name];
        if (tool) {
          spinner.stop();
          logTool(call.name);
          const output = await tool.execute(call.args);
          toolResponses.push({
            functionResponse: {
              name: call.name,
              response: { output },
            },
          });
          spinner.start("Thinking...");
        } else {
          toolResponses.push({
            functionResponse: {
              name: call.name,
              response: { error: `Tool ${call.name} not found` },
            },
          });
        }
      }

      history.push({ role: "user", parts: toolResponses });

      response = await generateContentWithRetry({
        model: modelId,
        contents: history,
        config: {
          tools: [{ functionDeclarations: toolDeclarations }],
        },
      });

      functionCalls = getFunctionCalls(response);
    }

    const finalText = response.text
      ? response.text
      : response.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ||
        "No text response";
    spinner.stop();

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

    history.push({ role: "model", parts: [{ text: finalOutput }] });
  } catch (error) {
    spinner.stop();
    logError(error.message || error);
  } finally {
    rl.resume();
    rl.prompt();
  }
});

rl.on("close", () => {
  console.log(chalk.dim("\nSession ended. See you next time!"));
  process.exit(0);
});
