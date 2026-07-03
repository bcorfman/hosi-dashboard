import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(CURRENT_DIR, "../../..");
const FRONTEND_DIR = path.join(ROOT, "frontend");
const BACKEND_DIR = path.join(ROOT, "backend");
const STATE_PATH = path.join(FRONTEND_DIR, ".playwright-processes.json");

function resolveBackendPython(): string {
  const candidates = [
    path.join(BACKEND_DIR, ".venv", "bin", "python"),
    path.join(BACKEND_DIR, ".venv", "bin", "python3"),
    path.join(BACKEND_DIR, ".venv", "Scripts", "python.exe"),
  ];

  const pythonPath = candidates.find((candidate) => existsSync(candidate));
  if (!pythonPath) {
    throw new Error(
      `Backend virtualenv not found. Expected one of: ${candidates.join(", ")}. ` +
        "Run `cd backend && uv venv && uv pip install -e .[dev]` first.",
    );
  }

  return pythonPath;
}
async function isReachable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForUrl(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isReachable(url)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function spawnService(
  name: string,
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = {},
): Promise<number | null> {
  if (
    (name === "backend" && (await isReachable("http://127.0.0.1:8000/health"))) ||
    (name === "frontend" && (await isReachable("http://127.0.0.1:4173")))
  ) {
    return null;
  }
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    detached: true,
    stdio: ["ignore", "ignore", "ignore"],
  });
  child.unref();
  return child.pid ?? null;
}

export default async function globalSetup(): Promise<void> {
  const backendPython = resolveBackendPython();
  const backendPid = await spawnService(
    "backend",
    backendPython,
    ["-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
    BACKEND_DIR,
  );
  await waitForUrl("http://127.0.0.1:8000/health", 120000);

  const frontendPid = await spawnService(
    "frontend",
    "npm",
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"],
    FRONTEND_DIR,
    { VITE_API_BASE: "http://127.0.0.1:8000" },
  );
  await waitForUrl("http://127.0.0.1:4173", 120000);

  await writeFile(
    STATE_PATH,
    JSON.stringify({ backendPid, frontendPid }, null, 2),
    "utf-8",
  );
}
