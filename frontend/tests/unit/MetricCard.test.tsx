import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetricCard } from "../../src/components/MetricCard";

describe("MetricCard", () => {
  it("renders the metric label, value, and note", () => {
    render(<MetricCard label="Overall HOSI" value={120.35} note="Latest month: 2026-06-01" />);

    expect(screen.getByText("Overall HOSI")).toBeInTheDocument();
    expect(screen.getByText("120.3")).toBeInTheDocument();
    expect(screen.getByText("Latest month: 2026-06-01")).toBeInTheDocument();
  });

  it("uses the low-stress tone when the score is below baseline", () => {
    const { container } = render(
      <MetricCard label="Service Capacity" value={98.51} note="Proxy for staffing pressure" />,
    );

    expect(container.firstChild).toHaveClass("tone-low");
  });
});

