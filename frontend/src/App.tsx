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
        <div className="hero-copy-block">
          <p className="eyebrow hero-kicker">Experimental Index</p>
          <h1>Household Opportunity & Stress Index</h1>
          <p className="hero-copy">
            HOSI shows when unemployment looks calm but families, job seekers, and everyday
            services are still under strain.
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

function stressDelta(value: number): string {
  const delta = Math.abs(value - 100).toFixed(1);
  return value >= 100
    ? `${delta} points more stress than 2019`
    : `${delta} points less stress than 2019`;
}

const HOSI_TIMELINE = [
  {
    date: "2020-04-01",
    label: "Pandemic shutdown shock",
    detail: "Mass layoffs, hiring freezes, and abrupt service closures sent stress sharply higher.",
  },
  {
    date: "2022-06-01",
    label: "Inflation and housing squeeze",
    detail:
      "The second major peak lines up with the inflation surge and the jump in borrowing costs that hit household budgets and affordability.",
  },
  {
    dateStart: "2024-06-01",
    dateEnd: "2026-06-01",
    label: "Cooling, not normalization",
    detail:
      "The sharpest shocks eased, but stress kept rebuilding across a longer stretch as affordability, weak mobility, and thinner household buffers failed to return to 2019 conditions.",
  },
] as const;

function OverviewPage({ latest, timeseries }: { latest: LatestResponse; timeseries: TimePoint[] }) {
  return (
    <Layout>
      <section className="panel intro-panel compact-panel">
        <div className="panel-head">
          <h2>How to Read This</h2>
          <p>
            Every score uses <strong>2019 = 100</strong> as the reference point. Numbers above 100
            mean more stress than pre-pandemic normal. Numbers below 100 mean less stress.
          </p>
        </div>
      </section>
      <section className="card-grid">
        <MetricCard
          label="Overall stress"
          value={latest.hosi}
          note={`Latest month: ${latest.date}`}
          directionLabel={stressDelta(latest.hosi)}
        />
        <MetricCard
          label="Financial stress"
          value={latest.financial_resilience}
          note="Savings, debt burden, delinquencies, and real earnings rolled into one stress score"
          directionLabel={stressDelta(latest.financial_resilience)}
        />
        <MetricCard
          label="Opportunity stress"
          value={latest.labor_opportunity}
          note="How hard it is to break in, switch jobs, or find better labor-market options"
          directionLabel={stressDelta(latest.labor_opportunity)}
        />
        <MetricCard
          label="Service pressure"
          value={latest.service_capacity}
          note="How much strain businesses face in actually staffing the services they advertise"
          directionLabel={stressDelta(latest.service_capacity)}
        />
      </section>
      <section className="panel compact-panel">
        <div className="panel-head">
          <h2>HOSI Time Series</h2>
          <p>
            The dashed line is the 2019 baseline. Only the clearest peaks and stress-build periods
            are annotated here. Smaller moves in a blended index often reflect several forces at
            once rather than one clean news event.
          </p>
        </div>
        <SectionChart
          data={timeseries}
          lines={[{ key: "value", label: "HOSI stress score", color: "#b5472d" }]}
          annotations={[...HOSI_TIMELINE]}
        />
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
          <p>
            These are all stress-style scores. Higher means a household is facing more pressure
            from that part of the economy.
          </p>
        </div>
        <SectionChart
          data={components.summary}
          lines={[
            { key: "financial_resilience", label: "Financial stress", color: "#7f2f20" },
            { key: "labor_opportunity", label: "Opportunity stress", color: "#2c6e63" },
            { key: "household_strain", label: "Household strain", color: "#aa7b00" },
            { key: "service_capacity", label: "Service pressure", color: "#3f4e8c" },
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
            Everything on this page is translated into plain language relative to 2019 so you do
            not have to decode whether “higher” is good or bad.
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
        <p>
          HOSI is intentionally written as a stress index, not a “goodness” index. That means
          higher numbers always indicate more strain relative to 2019, even when the underlying
          source series is something normally considered positive, like savings or job switching.
        </p>
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
