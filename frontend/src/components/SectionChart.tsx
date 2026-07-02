import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SectionChartProps = {
  data: Array<Record<string, string | number>>;
  lines: Array<{ key: string; label: string; color: string }>;
};

export function SectionChart({ data, lines }: SectionChartProps) {
  return (
    <div className="chart-shell">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d7dccf" />
          <XAxis dataKey="date" minTickGap={32} tick={{ fill: "#4f5747", fontSize: 12 }} />
          <YAxis tick={{ fill: "#4f5747", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.key}
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={2.5}
              dot={false}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

