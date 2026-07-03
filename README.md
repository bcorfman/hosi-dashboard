# HOSI Dashboard

**The economy can look fine on paper while feeling broken in real life.**

HOSI, the **Household Opportunity & Stress Index**, is an open-source dashboard built around a simple idea:

**Headline unemployment tells you who kept a job. HOSI tries to tell you whether ordinary people can stay afloat, move up, and access the services the economy claims to provide.**

Two economies can post the same unemployment rate and still feel completely different.

In one, teenagers can get summer jobs, graduates can find paid internships, families can absorb a surprise bill, and businesses are actually staffed.

In the other, older workers keep their jobs, young adults can't break in, internships are unpaid, families are stretched thin, and businesses run permanently understaffed.

Traditional topline statistics often blur that distinction.

HOSI is built to make it visible.

## What HOSI Measures

HOSI starts from a `2019 average = 100` baseline.

- Above `100` means conditions are more stressed than pre-pandemic normal.
- Below `100` means conditions are less stressed than that baseline.

The current index combines four pillars:

### 1. Financial Resilience
Can a household actually absorb pressure?

- personal saving rate
- housing-payment burden proxy
- credit-card delinquency
- real median weekly earnings

### 2. Opportunity
Can people actually get in, move up, and switch jobs?

- hires rate
- quits rate
- youth unemployment
- U-6 unemployment

### 3. Household Strain
Are people patching together stability the hard way?

- multiple jobholding

### 4. Service Capacity
Is the real economy staffed enough to deliver what it advertises?

- leisure and hospitality employment
- job openings pressure

This is still version one. The long-term vision is broader:

- entry-level job access
- paid vs unpaid internships
- applicant pressure for first jobs
- service availability signals
- behavioral confidence measures like delayed household decisions

## Why This Exists

Most people do not experience the economy as a spreadsheet.

They experience it as questions:

- Can my kid get a summer job?
- Can a recent graduate find a real first step?
- Can I switch jobs without falling backward?
- Can a family handle rent, insurance, food, and debt at the same time?
- Are businesses actually open at the capacity they advertise?

HOSI is an attempt to measure that lived economic ecosystem better than unemployment alone.

## What You Get

- A React + TypeScript frontend deployable to GitHub Pages
- A FastAPI backend deployable to Railway
- DuckDB + Parquet data artifacts for reproducible snapshots
- Monthly ETL against official public data
- Clear source notes and methodology endpoints
- A test stack with unit tests, Storybook tests, and Playwright smoke coverage

## Current Data Sources

Current automated inputs come from official public releases, mainly through stable FRED series access:

- `PSAVERT` personal saving rate
- `MDSP` mortgage debt service payments ratio
- `DRCCLACBS` credit-card delinquency rate
- `LEU0252881600Q` real median weekly earnings
- `JTSHIR` hires rate
- `JTSQUR` quits rate
- `LNS14024887` youth unemployment rate, ages 16-24
- `U6RATE` broad underemployment / labor underutilization
- `LNS12026620` multiple jobholders as a share of employed
- `USLAH` leisure and hospitality employment
- `JTUJOR` job openings rate

## Important Caveats

- HOSI is experimental. It is not an official government statistic.
- Higher values mean more stress, not “better performance.”
- Service-capacity pressure currently uses labor-market proxies, not direct operational wait-time or availability data.
- Housing affordability currently uses the official `MDSP` proxy because the FRED-hosted NAR fixed HAI history is too short for a reproducible automated `2019 = 100` workflow.
- Quarterly series are carried into monthly output so the dashboard can present a unified monthly view.

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

## Test Commands

### Backend

```bash
cd backend
. .venv/bin/activate
pytest
```

### Frontend

```bash
cd frontend
npm run test:unit
npm run test:stories
npm run test:e2e:smoke
```

## API

- `GET /api/hosi/latest`
- `GET /api/hosi/timeseries`
- `GET /api/components`
- `GET /api/sources`
- `GET /api/methodology`

## Deployment

### Railway Backend

Configure a Railway service with:

- source repo: `bcorfman/hosi-dashboard`
- branch: `main`
- root directory: `/backend`
- config file: [backend/railway.toml](/home/bcorfman/dev/hosi-dashboard/backend/railway.toml)
- public networking port: `8000`
- wait for CI: enabled

Once deployed, verify:

- `/health`
- `/api/hosi/latest`

### GitHub Pages Frontend

Set the repository variable `VITE_API_BASE` to the Railway backend URL, then deploy the Pages workflow from `main`.

The Pages job is intentionally skipped until `VITE_API_BASE` exists so the site does not publish with a dead API target.

## Extend It

The current registry is in [backend/app/services/methodology.py](/home/bcorfman/dev/hosi-dashboard/backend/app/services/methodology.py).

That makes HOSI easy to extend with future indicators like:

- internship pay
- entry-level hiring friction
- time-to-first-job
- customer wait times
- service availability
- household confidence behaviors

If unemployment mostly measures retention, HOSI is an attempt to measure **mobility, resilience, strain, and real-world economic capacity**.
