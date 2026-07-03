from __future__ import annotations

import requests
from requests import HTTPError

from etl.build_hosi import REQUEST_HEADERS, fetch_fred_csv, fred_csv_url


class StubResponse:
    def __init__(self, status_code: int, text: str = "DATE,VALUE\n2026-01-01,1.0\n") -> None:
        self.status_code = status_code
        self.text = text

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise HTTPError(f"{self.status_code} error", response=self)


def test_fetch_fred_csv_retries_transient_404(monkeypatch) -> None:
    calls: list[tuple[str, dict[str, str], int]] = []
    responses = [StubResponse(404), StubResponse(200)]

    def fake_get(url: str, headers: dict[str, str], timeout: int) -> StubResponse:
        calls.append((url, headers, timeout))
        return responses.pop(0)

    monkeypatch.setattr("etl.build_hosi.requests.get", fake_get)
    monkeypatch.setattr("etl.build_hosi.time.sleep", lambda _: None)

    csv_text = fetch_fred_csv("MDSP")

    assert csv_text.startswith("DATE,VALUE")
    assert len(calls) == 2
    assert calls[0] == (fred_csv_url("MDSP"), REQUEST_HEADERS, 60)


def test_fetch_fred_csv_raises_on_non_retryable_error(monkeypatch) -> None:
    def fake_get(url: str, headers: dict[str, str], timeout: int) -> StubResponse:
        return StubResponse(403)

    monkeypatch.setattr("etl.build_hosi.requests.get", fake_get)
    monkeypatch.setattr("etl.build_hosi.time.sleep", lambda _: None)

    try:
        fetch_fred_csv("MDSP")
    except RuntimeError as error:
        assert "Failed to download FRED series MDSP" in str(error)
        assert isinstance(error.__cause__, requests.HTTPError)
    else:
        raise AssertionError("Expected RuntimeError for non-retryable download failure")
