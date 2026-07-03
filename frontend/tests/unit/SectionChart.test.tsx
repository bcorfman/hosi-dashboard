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
        annotations={[
          { date: "2020-04-01", label: "Pandemic shutdown shock", detail: "Mass layoffs and hiring freezes." },
          { date: "2022-06-01", label: "Inflation and housing squeeze", detail: "Prices and borrowing costs climbed together." },
        ]}
      />,
    );

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByText("Pandemic shutdown shock")).toBeInTheDocument();
    expect(screen.getByText("Inflation and housing squeeze")).toBeInTheDocument();
  });
});
