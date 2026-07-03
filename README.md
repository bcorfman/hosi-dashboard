# HOSI Dashboard

HOSI is an experimental open-source Household Opportunity & Stress Index. It combines official public indicators into a single monthly signal anchored to a `2019 average = 100` baseline, with `higher = more stress`.

## Stack 

- Frontend: React + TypeScript + Vite, structured for GitHub Pages deployment.
- Backend: FastAPI, designed for Railway deployment.
- Data: DuckDB plus generated Parquet and JSON metadata artifacts.
- Charts: Recharts time-series with simple cards and tables. 

## What HOSI Measures

- Financial resilience: saving rate, mortgage-payment burden proxy, credit-card delinquency, real weekly earnings.
- Labor opportunity: hires, quits, youth unemployment, and U-6 unemployment.
- Household strain: multiple jobholding.
- Service capacity pressure: leisure/hospitality employment plus job openings pressure.

## Important Caveats

- HOSI is experimental and not an official statistic.
- Higher values mean more stress relative to the 2019 average.
- Service-capacity pressure uses labor-market proxies rather than direct service availability measures.
- The housing-affordability input currently uses an official proxy (`MDSP`) because the FRED-hosted NAR fixed HAI window is too short for a reproducible automated 2019-baseline ETL.

## Local Setup

### Backend

```bash
cd backend
uv venv
. .venv/bin/activate
uv pip install -e .[dev]
python -m etl.build_hosi
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
VITE_API_BASE=http://127.0.0.1:8000 npm run dev
```

## API

- `GET /api/hosi/latest`
- `GET /api/hosi/timeseries`
- `GET /api/components`
- `GET /api/sources`
- `GET /api/methodology`

## Deployment

### GitHub Pages

Set the repository variable `VITE_API_BASE` to the deployed Railway backend URL, then enable GitHub Pages in Actions mode. The Pages workflow is intentionally skipped until `VITE_API_BASE` is present so the static site does not publish with a broken API target.

### Railway

Deploy the backend as a Railway service with:

- Source repo: `bcorfman/hosi-dashboard`
- Branch: `main`
- Root directory: `/backend`
- Config file path: `/backend/railway.toml`
- Wait for CI: enabled

This mirrors the PhaserForge setup style while isolating HOSI to the Python backend only. The backend uses the committed `data/processed/hosi.duckdb` snapshot when present. If the snapshot is missing, the application rebuilds the dataset from source downloads on first request. The monthly GitHub Actions workflow also refreshes and commits the snapshot back to `main`.

After Railway assigns a public domain, set the GitHub repository variable `VITE_API_BASE` to that HTTPS URL so the GitHub Pages frontend can call the live API.

## Data Source Notes

Current automated inputs are official public series retrieved mainly through FRED CSV endpoints for stable machine access:

- `PSAVERT` personal saving rate
- `MDSP` mortgage debt service payment ratio as current housing-affordability proxy
- `DRCCLACBS` credit-card delinquency rate
- `LEU0252881600Q` real median weekly earnings
- `JTSHIR` hires rate
- `JTSQUR` quits rate
- `LNS14024887` youth unemployment rate, ages 16-24
- `U6RATE` broad unemployment underutilization
- `LNS12026620` multiple jobholders as a share of employed
- `USLAH` leisure and hospitality employment
- `JTUJOR` job openings rate

## Extending HOSI

The ETL registry lives in [backend/app/services/methodology.py](/home/bcorfman/dev/hosi-dashboard/backend/app/services/methodology.py). Add new indicators by defining a series, category, direction, and weight. The ETL and API will pick them up automatically as long as the data can be normalized to monthly frequency.
