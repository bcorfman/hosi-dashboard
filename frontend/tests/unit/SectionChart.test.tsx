import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionChart } from "../../src/components/SectionChart";
import { sampleTimeseries } from "../../src/testing/sampleData";

describe("SectionChart", () => {
  it("renders the responsive chart container", () => {
    render(
      <SectionChart
        data={sampleTimeseries}
        lines={[{ key: "value", label: "HOSI", color: "#b5472d" }]}
      />,
    );

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });
});
