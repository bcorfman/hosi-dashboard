import type { Meta, StoryObj } from "@storybook/react-vite";

import { MetricCard } from "./MetricCard";

const meta = {
  title: "Components/MetricCard",
  component: MetricCard,
} satisfies Meta<typeof MetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ElevatedStress: Story = {
  args: {
    label: "Overall HOSI",
    value: 120.35,
    note: "Latest month: 2026-06-01",
  },
};

export const ImprovedConditions: Story = {
  args: {
    label: "Service Capacity",
    value: 98.51,
    note: "Leisure/hospitality staffing and openings pressure",
  },
};

