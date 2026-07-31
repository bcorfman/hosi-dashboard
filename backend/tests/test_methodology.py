from __future__ import annotations

from app.services.methodology import GROUP_WEIGHTS, SERIES_DEFINITIONS


def test_group_weights_total_one() -> None:
    assert round(sum(GROUP_WEIGHTS.values()), 8) == 1.0


def test_series_weights_positive() -> None:
    assert all(series.weight > 0 for series in SERIES_DEFINITIONS)


def test_service_component_is_household_facing() -> None:
    service_series = [series for series in SERIES_DEFINITIONS if series.category == "service_access"]

    assert {series.key for series in service_series} == {
        "childcare_cost_index",
        "medical_care_cost_index",
        "childcare_employment",
        "healthcare_social_assistance_employment",
    }
    assert "service_capacity" not in GROUP_WEIGHTS
    assert GROUP_WEIGHTS["service_access"] == 0.20
