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
    label: "Overall stress",
    value: 120.35,
    note: "Latest month: 2026-06-01",
    directionLabel: "20.3 points more stress than 2019",
  },
};

export const ImprovedConditions: Story = {
  args: {
    label: "Service pressure",
    value: 98.51,
    note: "Leisure/hospitality staffing and openings pressure",
    directionLabel: "1.5 points less stress than 2019",
  },
};
