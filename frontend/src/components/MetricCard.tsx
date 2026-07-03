type MetricCardProps = {
  label: string;
  value: number;
  note: string;
  directionLabel: string;
};

export function MetricCard({ label, value, note, directionLabel }: MetricCardProps) {
  const tone = value >= 110 ? "high" : value >= 100 ? "mid" : "low";
  return (
    <article className={`metric-card tone-${tone}`}>
      <p className="eyebrow">{label}</p>
      <h3>{value.toFixed(1)}</h3>
      <p className="muted">{note}</p>
      <p className="delta-label">{directionLabel}</p>
    </article>
  );
}
