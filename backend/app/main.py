from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.data_store import fetch_all, methodology, sources

app = FastAPI(title="HOSI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/hosi/latest")
def hosi_latest() -> dict[str, object]:
    query = """
        SELECT
            strftime(date, '%Y-%m-%d') AS date,
            round(hosi, 2) AS hosi,
            round(financial_resilience, 2) AS financial_resilience,
            round(labor_opportunity, 2) AS labor_opportunity,
            round(household_strain, 2) AS household_strain,
            round(service_capacity, 2) AS service_capacity
        FROM hosi_monthly
        ORDER BY date DESC
        LIMIT 1
    """
    return fetch_all(query)[0]


@app.get("/api/hosi/timeseries")
def hosi_timeseries() -> list[dict[str, object]]:
    query = """
        SELECT strftime(date, '%Y-%m-%d') AS date, round(hosi, 2) AS value
        FROM hosi_monthly
        ORDER BY date
    """
    return fetch_all(query)


@app.get("/api/components")
def components() -> dict[str, object]:
    summary = fetch_all(
        """
        SELECT
            strftime(date, '%Y-%m-%d') AS date,
            round(financial_resilience, 2) AS financial_resilience,
            round(labor_opportunity, 2) AS labor_opportunity,
            round(household_strain, 2) AS household_strain,
            round(service_capacity, 2) AS service_capacity
        FROM hosi_monthly
        ORDER BY date
        """
    )
    detail = fetch_all(
        """
        SELECT
            strftime(date, '%Y-%m-%d') AS date,
            "group",
            metric,
            round(score, 2) AS score,
            round(raw_value, 2) AS raw_value,
            round(baseline_2019, 2) AS baseline_2019
        FROM component_scores
        ORDER BY date, "group", metric
        """
    )
    return {"summary": summary, "detail": detail}


@app.get("/api/sources")
def source_metadata() -> object:
    return sources()


@app.get("/api/methodology")
def methodology_notes() -> object:
    return methodology()

