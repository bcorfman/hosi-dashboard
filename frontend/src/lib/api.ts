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

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return response.json() as Promise<T>;
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
