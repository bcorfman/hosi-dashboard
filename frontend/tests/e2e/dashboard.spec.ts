import { expect, test } from "@playwright/test";

test("@smoke loads the dashboard overview and component pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Household Opportunity & Stress Index" })).toBeVisible();
  await expect(page.getByText("Compare post-pandemic household conditions")).toBeVisible();
  await expect(page.getByText("Overall HOSI")).toBeVisible();
  await expect(page.getByText("Latest month: 2026-06-01")).toBeVisible();

  await page.getByRole("link", { name: "Components" }).click();
  await expect(page.getByRole("heading", { name: "Component Breakdown" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Metric" })).toBeVisible();

  await page.getByRole("link", { name: "Methodology" }).click();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await expect(page.getByText("HOSI is experimental and not an official government statistic.")).toBeVisible();
});
