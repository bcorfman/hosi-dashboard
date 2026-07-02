from __future__ import annotations

import json
from pathlib import Path

import duckdb
import pandas as pd
import requests

from app.services.methodology import (
    GROUP_WEIGHTS,
    METHODOLOGY,
    SERIES_DEFINITIONS,
    SeriesDefinition,
)

ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
DB_PATH = PROCESSED_DIR / "hosi.duckdb"
PARQUET_PATH = PROCESSED_DIR / "hosi_monthly.parquet"
COMPONENTS_PATH = PROCESSED_DIR / "component_scores.parquet"
SOURCES_PATH = PROCESSED_DIR / "sources.json"
METHODOLOGY_PATH = PROCESSED_DIR / "methodology.json"


def fred_csv_url(series_id: str) -> str:
    return f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"


def download_series(definition: SeriesDefinition) -> pd.DataFrame:
    response = requests.get(fred_csv_url(definition.series_id), timeout=60)
    response.raise_for_status()
    csv_path = RAW_DIR / f"{definition.series_id}.csv"
    csv_path.write_text(response.text, encoding="utf-8")
    frame = pd.read_csv(csv_path)
    frame.columns = ["date", "value"]
    frame["date"] = pd.to_datetime(frame["date"], errors="coerce")
    frame["value"] = pd.to_numeric(frame["value"], errors="coerce")
    frame = frame.dropna(subset=["date", "value"]).copy()
    frame["series"] = definition.key
    frame["series_id"] = definition.series_id
    return frame


def to_monthly(frame: pd.DataFrame, definition: SeriesDefinition) -> pd.DataFrame:
    data = frame.sort_values("date").copy()
    data = data.set_index("date")
    monthly = data.resample("MS").ffill().reset_index()
    monthly["series"] = definition.key
    monthly["series_id"] = definition.series_id
    monthly["is_observed_frequency"] = monthly["date"].isin(frame["date"])
    return monthly[["date", "series", "series_id", "value", "is_observed_frequency"]]


def score_series(frame: pd.DataFrame) -> pd.DataFrame:
    definitions = {definition.key: definition for definition in SERIES_DEFINITIONS}
    scored_frames: list[pd.DataFrame] = []
    for series_key, series_frame in frame.groupby("series"):
        definition = definitions[series_key]
        baseline = series_frame.loc[series_frame["date"].dt.year == 2019, "value"].mean()
        if pd.isna(baseline) or baseline == 0:
            raise ValueError(f"Missing or zero 2019 baseline for {series_key}")
        scored = series_frame.copy()
        scored["baseline_2019"] = baseline
        if definition.direction == "negative":
            scored["score"] = scored["value"] / baseline * 100.0
        else:
            scored["score"] = baseline / scored["value"] * 100.0
        scored["category"] = definition.category
        scored["weight"] = definition.weight
        scored["direction"] = definition.direction
        scored_frames.append(scored)
    return pd.concat(scored_frames, ignore_index=True)


def weighted_average(frame: pd.DataFrame, value_column: str, weight_column: str) -> float:
    return float((frame[value_column] * frame[weight_column]).sum() / frame[weight_column].sum())


def build_component_scores(scored: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    components = (
        scored.groupby(["date", "category"], as_index=False)
        .apply(lambda group: pd.Series({"score": weighted_average(group, "score", "weight")}))
        .reset_index(drop=True)
    )
    components["group_weight"] = components["category"].map(GROUP_WEIGHTS)
    hosi = (
        components.groupby("date", as_index=False)
        .apply(lambda group: pd.Series({"hosi": weighted_average(group, "score", "group_weight")}))
        .reset_index(drop=True)
    )
    return components, hosi


def write_metadata() -> None:
    sources = [
        {
            "key": definition.key,
            "title": definition.title,
            "source": definition.source,
            "dataset": definition.dataset,
            "series_id": definition.series_id,
            "frequency": definition.frequency,
            "category": definition.category,
            "direction": definition.direction,
            "weight": definition.weight,
            "units": definition.units,
            "notes": definition.notes,
            "public_url": definition.public_url,
        }
        for definition in SERIES_DEFINITIONS
    ]
    SOURCES_PATH.write_text(json.dumps(sources, indent=2), encoding="utf-8")
    METHODOLOGY_PATH.write_text(json.dumps(METHODOLOGY, indent=2), encoding="utf-8")


def build_dataset() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    monthly_frames = [
        to_monthly(download_series(definition), definition) for definition in SERIES_DEFINITIONS
    ]
    normalized = pd.concat(monthly_frames, ignore_index=True).sort_values(["date", "series"])
    scored = score_series(normalized)
    components, hosi = build_component_scores(scored)

    wide_components = (
        components.pivot(index="date", columns="category", values="score")
        .reset_index()
        .rename_axis(None, axis=1)
    )
    final = hosi.merge(wide_components, on="date", how="left").sort_values("date")
    final.to_parquet(PARQUET_PATH, index=False)

    component_details = scored[
        ["date", "category", "series", "score", "value", "baseline_2019"]
    ].rename(columns={"category": "group", "series": "metric", "value": "raw_value"})
    component_details.to_parquet(COMPONENTS_PATH, index=False)

    write_metadata()

    with duckdb.connect(str(DB_PATH)) as connection:
        connection.execute(
            "CREATE OR REPLACE TABLE hosi_monthly AS SELECT * FROM read_parquet(?)",
            [str(PARQUET_PATH)],
        )
        connection.execute(
            "CREATE OR REPLACE TABLE component_scores AS SELECT * FROM read_parquet(?)",
            [str(COMPONENTS_PATH)],
        )
        connection.execute(
            "CREATE OR REPLACE TABLE sources AS SELECT * FROM read_json_auto(?)",
            [str(SOURCES_PATH)],
        )
        connection.execute(
            "CREATE OR REPLACE TABLE methodology AS SELECT * FROM read_json_auto(?)",
            [str(METHODOLOGY_PATH)],
        )


if __name__ == "__main__":
    build_dataset()
