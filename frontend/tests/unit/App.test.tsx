// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ComparisonPage } from "../../src/App";

describe("ComparisonPage", () => {
  afterEach(() => cleanup());

  it("shows the formulas behind the comparison scores", () => {
    render(
      <ComparisonPage
        latest={{
          date: "2026-01-01",
          hosi: 110,
          financial_resilience: 105,
          labor_opportunity: 115,
          household_strain: 108,
          service_access: 112,
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "How the score is calculated" })).toBeInTheDocument();
    expect(screen.getByText("current value ÷ 2019 average × 100")).toBeInTheDocument();
    expect(screen.getByText("2019 average ÷ current value × 100")).toBeInTheDocument();
    expect(screen.getByText("Σ (source score × series weight) ÷ Σ series weights")).toBeInTheDocument();
    expect(screen.getByText("Σ (component score × group weight) ÷ Σ group weights")).toBeInTheDocument();
  });
});
