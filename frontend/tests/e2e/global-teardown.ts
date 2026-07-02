import { readFile, rm } from "node:fs/promises";
import path from "node:path";

const STATE_PATH = path.join(
  "/home/bcorfman/dev/hosi-dashboard/frontend",
  ".playwright-processes.json",
);

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

