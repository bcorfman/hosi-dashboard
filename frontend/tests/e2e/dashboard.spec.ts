import { expect, test } from "@playwright/test";

test("@smoke loads the dashboard overview and component pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Household Opportunity & Stress Index" })).toBeVisible();
  await expect(page.getByText("HOSI shows when unemployment looks calm")).toBeVisible();
  await expect(page.getByText("Overall stress")).toBeVisible();
  await expect(page.getByText("Latest month: 2026-06-01")).toBeVisible();
  await expect(page.getByText(/\d+\.\d+ points (more|less) stress than 2019/).first()).toBeVisible();
  await expect(page.getByText("Pandemic shutdown shock")).toBeVisible();
  await expect(page.getByText("Inflation and housing squeeze")).toBeVisible();
  await expect(page.getByText("Cooling, not normalization")).toBeVisible();
  await expect(page.getByText("Only the clearest peaks and stress-build periods are annotated here")).toBeVisible();
  await expect(page.getByText("Service access stress")).toBeVisible();

  await page.getByRole("link", { name: "Components" }).click();
  await expect(page.getByRole("heading", { name: "Component Breakdown" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Metric" })).toBeVisible();

  await page.getByRole("link", { name: "Methodology" }).click();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await expect(page.getByText("HOSI is experimental and not an official government statistic.")).toBeVisible();
});
