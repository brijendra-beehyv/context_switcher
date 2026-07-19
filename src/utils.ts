import { promisify } from "node:util";
import { exec } from "node:child_process";

export const execAsync = promisify(exec);

export const CLEAR_SCREEN = "\x1b[H\x1b[2J";
