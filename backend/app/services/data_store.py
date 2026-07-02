from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import duckdb

from etl.build_hosi import DB_PATH, METHODOLOGY_PATH, PROCESSED_DIR, SOURCES_PATH, build_dataset


def _data_dir() -> Path:
    return Path(os.getenv("HOSI_DATA_DIR", str(PROCESSED_DIR)))


def _db_path() -> Path:
    return _data_dir() / DB_PATH.name


def ensure_data() -> None:
    if _db_path().exists():
        return
    build_dataset()


def fetch_all(query: str) -> list[dict[str, Any]]:
    ensure_data()
    with duckdb.connect(str(_db_path()), read_only=True) as connection:
        rows = connection.execute(query).fetchdf()
    return json.loads(rows.to_json(orient="records", date_format="iso"))


def load_json(path: Path) -> Any:
    ensure_data()
    return json.loads(path.read_text(encoding="utf-8"))


def sources() -> Any:
    return load_json(_data_dir() / SOURCES_PATH.name)


def methodology() -> Any:
    return load_json(_data_dir() / METHODOLOGY_PATH.name)

