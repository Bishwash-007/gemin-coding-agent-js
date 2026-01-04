import figlet from "figlet";
import gradient from "gradient-string";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import chalk from "chalk";

marked.setOptions({
  renderer: new TerminalRenderer(),
});

export const showBanner = () => {
  console.clear();
  const banner = figlet.textSync("Brainiac AI", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(gradient.pastel.multiline(banner));
  console.log(gradient.pastel("  Your Personal Copilot\n"));
  console.log(chalk.dim('   Type "exit" to quit.\n'));
};

export const logUser = (text) => {
  console.log(chalk.hex("#00BFFF").bold("\nYou:"));
  console.log(chalk.white(text));
};

export const logAgent = (text) => {
  console.log(chalk.hex("#FF00FF").bold("\nBrainiac AI:"));
  console.log(marked(text));
};

export const logFollowUp = (text) => {
  console.log(chalk.hex("#7CFC00").bold("\nNext Step:"));
  console.log(chalk.hex("#7CFC00")(text));
};

export const logTool = (toolName) => {
  console.log(chalk.yellow(`\nExecuting tool: ${chalk.bold(toolName)}...`));
};

export const logToolResult = (toolName, result) => {
  if (!result) {
    return;
  }
  console.log(chalk.hex("#FFD700")(`-> ${toolName} result:`));

  console.log(chalk.hex("#FFFFE0")(result));
};

export const logToolStreamStart = (target) => {
  console.log(chalk.hex("#FFD700")(`   writing ${target}`));
};

export const logToolStreamChunk = (lineNumber, text) => {
  const label =
    typeof lineNumber === "number"
      ? lineNumber.toString().padStart(4, " ")
      : "    ";
  console.log(chalk.hex("#D3D3D3")(`${label} | ${text}`));
};

export const logError = (error) => {
  console.log(chalk.red.bold("\nError:"));
  console.log(chalk.red(error));
};
