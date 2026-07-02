from __future__ import annotations

from pydantic import BaseModel


class LatestIndexResponse(BaseModel):
    date: str
    hosi: float
    financial_resilience: float
    labor_opportunity: float
    household_strain: float
    service_capacity: float


class TimePoint(BaseModel):
    date: str
    value: float


class ComponentPoint(BaseModel):
    date: str
    group: str
    metric: str
    score: float
    raw_value: float

