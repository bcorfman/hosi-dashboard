from __future__ import annotations

from app.services.methodology import GROUP_WEIGHTS, SERIES_DEFINITIONS


def test_group_weights_total_one() -> None:
    assert round(sum(GROUP_WEIGHTS.values()), 8) == 1.0


def test_series_weights_positive() -> None:
    assert all(series.weight > 0 for series in SERIES_DEFINITIONS)

