import * as fs from "node:fs/promises";
import * as readline from "node:readline";
import { InputError } from "../utils/errors.js";

/**
 * Read input text from --text, --file, or stdin (priority order).
 */
export async function readInput(
  text?: string,
  filePath?: string,
): Promise<string> {
  if (text) {
    return text;
  }

  if (filePath) {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      throw new InputError(`Failed to read file: ${filePath}`);
    }
  }

  if (!process.stdin.isTTY) {
    return readStdin();
  }

  throw new InputError(
    "No input provided. Use --text, --file, or pipe text via stdin.",
  );
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const lines: string[] = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on("line", (line: string) => {
      lines.push(line);
    });

    rl.on("close", () => {
      const result = lines.join("\n").trim();
      if (result.length === 0) {
        reject(new InputError("Stdin is empty"));
      } else {
        resolve(result);
      }
    });

    rl.on("error", (error: Error) => {
      reject(new InputError(`Failed to read stdin: ${error.message}`));
    });
  });
}
