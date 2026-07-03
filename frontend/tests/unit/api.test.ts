import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getJson } from "../../src/lib/api";

describe("api client retries", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("retries after a transient network failure and returns JSON", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const request = getJson<{ ok: boolean }>("/api/test", { retryDelaysMs: [50] });
    await vi.advanceTimersByTimeAsync(50);

    await expect(request).resolves.toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("retries once on a transient 503 response", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response("service unavailable", {
          status: 503,
          statusText: "Service Unavailable",
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const request = getJson<{ ok: boolean }>("/api/test", { retryDelaysMs: [25] });
    await vi.advanceTimersByTimeAsync(25);

    await expect(request).resolves.toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("fails immediately on a non-retryable response", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("forbidden", {
        status: 403,
        statusText: "Forbidden",
      }),
    );

    await expect(getJson("/api/test", { retryDelaysMs: [25] })).rejects.toThrow(
      "Request failed: /api/test",
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
