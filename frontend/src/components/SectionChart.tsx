import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Annotation = {
  date: string;
  label: string;
  detail: string;
};

type SectionChartProps = {
  data: Array<Record<string, string | number>>;
  lines: Array<{ key: string; label: string; color: string }>;
  annotations?: Annotation[];
};

export function SectionChart({ data, lines, annotations = [] }: SectionChartProps) {
  return (
    <div>
      <div className="chart-shell">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d7dccf" />
            <XAxis dataKey="date" minTickGap={32} tick={{ fill: "#4f5747", fontSize: 12 }} />
            <YAxis tick={{ fill: "#4f5747", fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <ReferenceLine
              y={100}
              stroke="#6d745f"
              strokeDasharray="4 4"
              label={{ value: "2019 baseline", fill: "#4f5747", fontSize: 12 }}
            />
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
      {annotations.length > 0 ? (
        <div className="annotation-strip">
          {annotations.map((annotation) => (
            <article className="annotation-card" key={`${annotation.date}-${annotation.label}`}>
              <p className="eyebrow">{annotation.date}</p>
              <h3>{annotation.label}</h3>
              <p className="muted">{annotation.detail}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
