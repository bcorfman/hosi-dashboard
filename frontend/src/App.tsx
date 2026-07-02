import { NavLink, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, ComponentResponse, LatestResponse, TimePoint } from "./lib/api";
import { MetricCard } from "./components/MetricCard";
import { SectionChart } from "./components/SectionChart";

type Methodology = {
  title: string;
  baseline_year: number;
  scoring: string;
  aggregation: Record<string, string>;
  caveats: string[];
};

function useDashboardData() {
  const [latest, setLatest] = useState<LatestResponse | null>(null);
  const [timeseries, setTimeseries] = useState<TimePoint[]>([]);
  const [components, setComponents] = useState<ComponentResponse | null>(null);
  const [sources, setSources] = useState<Array<Record<string, string | number>>>([]);
  const [methodology, setMethodology] = useState<Methodology | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.latest(), api.timeseries(), api.components(), api.sources(), api.methodology()])
      .then(([latestData, timeseriesData, componentData, sourceData, methodologyData]) => {
        setLatest(latestData);
        setTimeseries(timeseriesData);
        setComponents(componentData);
        setSources(sourceData);
        setMethodology(methodologyData);
      })
      .catch((requestError: Error) => setError(requestError.message));
  }, []);

  return { latest, timeseries, components, sources, methodology, error };
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Experimental Index</p>
          <h1>Household Opportunity & Stress Index</h1>
          <p className="hero-copy">
            Compare post-pandemic household conditions against a 2019 baseline instead of relying on
            headline unemployment alone.
          </p>
        </div>
        <nav className="nav">
          <NavLink to="/">Overview</NavLink>
          <NavLink to="/components">Components</NavLink>
          <NavLink to="/comparison">Comparison</NavLink>
          <NavLink to="/methodology">Methodology</NavLink>
        </nav>
      </header>
      {children}
    </div>
  );
}

function OverviewPage({ latest, timeseries }: { latest: LatestResponse; timeseries: TimePoint[] }) {
  return (
    <Layout>
      <section className="card-grid">
        <MetricCard label="Overall HOSI" value={latest.hosi} note={`Latest month: ${latest.date}`} />
        <MetricCard
          label="Financial Resilience"
          value={latest.financial_resilience}
          note="Savings, debt-service, delinquency, and earnings"
        />
        <MetricCard
          label="Labor Opportunity"
          value={latest.labor_opportunity}
          note="Hires, quits, youth unemployment, and U-6"
        />
        <MetricCard
          label="Service Capacity"
          value={latest.service_capacity}
          note="Leisure/hospitality staffing and openings pressure"
        />
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>HOSI Time Series</h2>
          <p>2019 average = 100. Higher values mean more stress.</p>
        </div>
        <SectionChart data={timeseries} lines={[{ key: "value", label: "HOSI", color: "#b5472d" }]} />
      </section>
    </Layout>
  );
}

function ComponentsPage({ components }: { components: ComponentResponse }) {
  return (
    <Layout>
      <section className="panel">
        <div className="panel-head">
          <h2>Component Breakdown</h2>
          <p>Grouped scores show where overall stress is coming from.</p>
        </div>
        <SectionChart
          data={components.summary}
          lines={[
            { key: "financial_resilience", label: "Financial resilience", color: "#7f2f20" },
            { key: "labor_opportunity", label: "Labor opportunity", color: "#2c6e63" },
            { key: "household_strain", label: "Household strain", color: "#aa7b00" },
            { key: "service_capacity", label: "Service capacity", color: "#3f4e8c" },
          ]}
        />
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>Underlying Metrics</h2>
          <p>Latest values versus each series' 2019 baseline.</p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Group</th>
              <th>Metric</th>
              <th>Score</th>
              <th>Raw</th>
              <th>2019 Avg</th>
            </tr>
          </thead>
          <tbody>
            {components.detail.slice(-18).reverse().map((row, index) => (
              <tr key={`${row.date}-${row.metric}-${index}`}>
                <td>{String(row.date)}</td>
                <td>{String(row.group)}</td>
                <td>{String(row.metric)}</td>
                <td>{Number(row.score).toFixed(1)}</td>
                <td>{Number(row.raw_value).toFixed(2)}</td>
                <td>{Number(row.baseline_2019).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

function ComparisonPage({ latest }: { latest: LatestResponse }) {
  const rows = [
    ["Overall HOSI", latest.hosi],
    ["Financial resilience", latest.financial_resilience],
    ["Labor opportunity", latest.labor_opportunity],
    ["Household strain", latest.household_strain],
    ["Service capacity", latest.service_capacity],
  ];
  return (
    <Layout>
      <section className="panel">
        <div className="panel-head">
          <h2>Pre-Pandemic vs Current</h2>
          <p>
            Scores above 100 indicate more stress than the 2019 baseline. Scores below 100 indicate
            less stress than 2019.
          </p>
        </div>
        <div className="comparison-list">
          {rows.map(([label, value]) => (
            <article className="comparison-row" key={label}>
              <div>
                <p className="eyebrow">{label}</p>
                <h3>{Number(value).toFixed(1)}</h3>
              </div>
              <p className="comparison-text">
                {Number(value) > 100
                  ? `${(Number(value) - 100).toFixed(1)} points more stressed than 2019`
                  : `${(100 - Number(value)).toFixed(1)} points less stressed than 2019`}
              </p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function MethodologyPage({
  methodology,
  sources,
}: {
  methodology: Methodology;
  sources: Array<Record<string, string | number>>;
}) {
  return (
    <Layout>
      <section className="panel prose">
        <h2>{methodology.title}</h2>
        <p>{methodology.scoring}</p>
        <p>{methodology.aggregation.component_level}</p>
        <p>{methodology.aggregation.index_level}</p>
        <h3>Caveats</h3>
        <ul>
          {methodology.caveats.map((caveat) => (
            <li key={caveat}>{caveat}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>Sources</h2>
          <p>All current inputs are official public releases, primarily consumed via FRED CSV downloads.</p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Series ID</th>
              <th>Group</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={String(source.key)}>
                <td>{String(source.title)}</td>
                <td>{String(source.series_id)}</td>
                <td>{String(source.category)}</td>
                <td>{String(source.notes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default function App() {
  const { latest, timeseries, components, sources, methodology, error } = useDashboardData();

  if (error) {
    return <div className="status-shell">Failed to load dashboard data: {error}</div>;
  }
  if (!latest || !components || !methodology) {
    return <div className="status-shell">Loading HOSI dashboard…</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<OverviewPage latest={latest} timeseries={timeseries} />} />
      <Route path="/components" element={<ComponentsPage components={components} />} />
      <Route path="/comparison" element={<ComparisonPage latest={latest} />} />
      <Route path="/methodology" element={<MethodologyPage methodology={methodology} sources={sources} />} />
    </Routes>
  );
}

