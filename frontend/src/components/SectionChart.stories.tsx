import type { Meta, StoryObj } from "@storybook/react-vite";

import { sampleComponentSummary, sampleTimeseries } from "../testing/sampleData";
import { SectionChart } from "./SectionChart";

const meta = {
  title: "Components/SectionChart",
  component: SectionChart,
} satisfies Meta<typeof SectionChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OverallHosi: Story = {
  args: {
    data: sampleTimeseries,
    lines: [{ key: "value", label: "HOSI", color: "#b5472d" }],
  },
};

export const ComponentBreakdown: Story = {
  args: {
    data: sampleComponentSummary,
    lines: [
      { key: "financial_resilience", label: "Financial resilience", color: "#7f2f20" },
      { key: "labor_opportunity", label: "Labor opportunity", color: "#2c6e63" },
      { key: "household_strain", label: "Household strain", color: "#aa7b00" },
      { key: "service_capacity", label: "Service capacity", color: "#3f4e8c" },
    ],
  },
};

