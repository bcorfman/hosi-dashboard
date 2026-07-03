import { expect, test } from "@playwright/test";

test("@smoke loads the dashboard overview and component pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Household Opportunity & Stress Index" })).toBeVisible();
  await expect(page.getByText("Unemployment can stay low while opportunity dries up")).toBeVisible();
  await expect(page.getByText("Overall stress")).toBeVisible();
  await expect(page.getByText("Latest month: 2026-06-01")).toBeVisible();
  await expect(page.getByText("20.3 points more stress than 2019")).toBeVisible();
  await expect(page.getByText("Pandemic shutdown shock")).toBeVisible();
  await expect(page.getByText("Inflation and housing squeeze")).toBeVisible();
  await expect(page.getByText("Only the clearest peaks are annotated here")).toBeVisible();

  await page.getByRole("link", { name: "Components" }).click();
  await expect(page.getByRole("heading", { name: "Component Breakdown" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Metric" })).toBeVisible();

  await page.getByRole("link", { name: "Methodology" }).click();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await expect(page.getByText("HOSI is experimental and not an official government statistic.")).toBeVisible();
});
