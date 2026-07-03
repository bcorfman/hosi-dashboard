import { readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.resolve(CURRENT_DIR, "../../.playwright-processes.json");

function killPid(pid: number | null): void {
  if (!pid) {
    return;
  }
  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // Ignore already-exited processes.
    }
  }
}

export default async function globalTeardown(): Promise<void> {
  try {
    const state = JSON.parse(await readFile(STATE_PATH, "utf-8")) as {
      backendPid: number | null;
      frontendPid: number | null;
    };
    killPid(state.frontendPid);
    killPid(state.backendPid);
    await rm(STATE_PATH, { force: true });
  } catch {
    // Ignore missing state.
  }
}
