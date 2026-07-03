// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/react-vite";
import { afterEach, describe, expect, it } from "vitest";

import * as metricCardStories from "../../src/components/MetricCard.stories";
import * as sectionChartStories from "../../src/components/SectionChart.stories";

const metricCards = composeStories(metricCardStories);
const sectionCharts = composeStories(sectionChartStories);

describe("storybook stories", () => {
  afterEach(() => cleanup());

  it("renders the elevated stress metric card story", () => {
    render(<metricCards.ElevatedStress />);
    expect(screen.getByText("Overall stress")).toBeInTheDocument();
    expect(screen.getByText("120.3")).toBeInTheDocument();
  });

  it("renders the component breakdown chart story", () => {
    render(<sectionCharts.ComponentBreakdown />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });
});
