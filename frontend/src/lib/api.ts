export type LatestResponse = {
  date: string;
  hosi: number;
  financial_resilience: number;
  labor_opportunity: number;
  household_strain: number;
  service_capacity: number;
};

export type TimePoint = {
  date: string;
  value: number;
};

export type ComponentResponse = {
  summary: Array<Record<string, string | number>>;
  detail: Array<Record<string, string | number>>;
};

const API_BASE = import.meta.env.VITE_API_BASE || "";
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type RequestOptions = {
  retryDelaysMs?: number[];
};

export async function getJson<T>(
  path: string,
  { retryDelaysMs = [400, 1200] }: RequestOptions = {},
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE}${path}`);
      if (!response.ok) {
        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < retryDelaysMs.length) {
          await sleep(retryDelaysMs[attempt]);
          continue;
        }
        throw new Error(`Request failed: ${path}`);
      }
      return response.json() as Promise<T>;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt >= retryDelaysMs.length) {
        break;
      }
      if (!(error instanceof TypeError)) {
        throw error;
      }
      await sleep(retryDelaysMs[attempt]);
      continue;
    }
  }

  throw lastError ?? new Error(`Request failed: ${path}`);
}

export const api = {
  latest: () => getJson<LatestResponse>("/api/hosi/latest"),
  timeseries: () => getJson<TimePoint[]>("/api/hosi/timeseries"),
  components: () => getJson<ComponentResponse>("/api/components"),
  sources: () => getJson<Array<Record<string, string | number>>>("/api/sources"),
  methodology: () =>
    getJson<{
      title: string;
      baseline_year: number;
      scoring: string;
      aggregation: Record<string, string>;
      caveats: string[];
    }>("/api/methodology"),
};
