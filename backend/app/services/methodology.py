from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SeriesDefinition:
    key: str
    title: str
    source: str
    dataset: str
    series_id: str
    frequency: str
    category: str
    direction: str
    weight: float
    units: str
    notes: str
    public_url: str


SERIES_DEFINITIONS: tuple[SeriesDefinition, ...] = (
    SeriesDefinition(
        key="personal_saving_rate",
        title="Personal Saving Rate",
        source="U.S. Bureau of Economic Analysis via FRED",
        dataset="Personal Income and Outlays",
        series_id="PSAVERT",
        frequency="monthly",
        category="financial_resilience",
        direction="positive",
        weight=0.30,
        units="percent",
        notes="Higher saving implies stronger household resilience and lowers HOSI stress.",
        public_url="https://fred.stlouisfed.org/series/PSAVERT",
    ),
    SeriesDefinition(
        key="housing_affordability_proxy",
        title="Mortgage Debt Service Payments Ratio",
        source="Federal Reserve Board via FRED",
        dataset="Household Debt Service and Financial Obligations Ratios",
        series_id="MDSP",
        frequency="quarterly",
        category="financial_resilience",
        direction="negative",
        weight=0.25,
        units="percent",
        notes=(
            "Fallback proxy for housing affordability. FRED's current NAR fixed HAI series "
            "does not provide a usable 2019-to-current monthly history for automated "
            "reproducible ETL."
        ),
        public_url="https://fred.stlouisfed.org/series/MDSP",
    ),
    SeriesDefinition(
        key="credit_card_delinquency",
        title="Credit Card Delinquency Rate",
        source="Federal Reserve Board via FRED",
        dataset="Charge-Off and Delinquency Rates on Loans and Leases",
        series_id="DRCCLACBS",
        frequency="quarterly",
        category="financial_resilience",
        direction="negative",
        weight=0.20,
        units="percent",
        notes="Higher delinquency indicates rising household financial stress.",
        public_url="https://fred.stlouisfed.org/series/DRCCLACBS",
    ),
    SeriesDefinition(
        key="real_median_weekly_earnings",
        title="Real Median Weekly Earnings",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Current Population Survey Weekly Earnings",
        series_id="LEU0252881600Q",
        frequency="quarterly",
        category="financial_resilience",
        direction="positive",
        weight=0.25,
        units="1982-84 CPI adjusted dollars",
        notes="Higher real earnings reduce household stress.",
        public_url="https://fred.stlouisfed.org/series/LEU0252881600Q",
    ),
    SeriesDefinition(
        key="hires_rate",
        title="Hires Rate",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Job Openings and Labor Turnover Survey",
        series_id="JTSHIR",
        frequency="monthly",
        category="labor_opportunity",
        direction="positive",
        weight=0.30,
        units="percent",
        notes="Higher hires imply stronger labor market opportunity.",
        public_url="https://fred.stlouisfed.org/series/JTSHIR",
    ),
    SeriesDefinition(
        key="quits_rate",
        title="Quits Rate",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Job Openings and Labor Turnover Survey",
        series_id="JTSQUR",
        frequency="monthly",
        category="labor_opportunity",
        direction="positive",
        weight=0.25,
        units="percent",
        notes="Higher quits typically indicate worker confidence and better outside options.",
        public_url="https://fred.stlouisfed.org/series/JTSQUR",
    ),
    SeriesDefinition(
        key="youth_unemployment",
        title="Youth Unemployment Rate (16-24)",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Current Population Survey",
        series_id="LNS14024887",
        frequency="monthly",
        category="labor_opportunity",
        direction="negative",
        weight=0.20,
        units="percent",
        notes="Higher youth unemployment points to weaker entry-level opportunity.",
        public_url="https://fred.stlouisfed.org/series/LNS14024887",
    ),
    SeriesDefinition(
        key="u6_unemployment",
        title="U-6 Unemployment Rate",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Current Population Survey",
        series_id="U6RATE",
        frequency="monthly",
        category="labor_opportunity",
        direction="negative",
        weight=0.25,
        units="percent",
        notes="Broader labor underutilization measure than headline unemployment.",
        public_url="https://fred.stlouisfed.org/series/U6RATE",
    ),
    SeriesDefinition(
        key="multiple_jobholders",
        title="Multiple Jobholders as Percent of Employed",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Current Population Survey",
        series_id="LNS12026620",
        frequency="monthly",
        category="household_strain",
        direction="negative",
        weight=1.00,
        units="percent",
        notes=(
            "More people working multiple jobs can indicate rising strain or income "
            "insufficiency."
        ),
        public_url="https://fred.stlouisfed.org/series/LNS12026620",
    ),
    SeriesDefinition(
        key="childcare_cost_index",
        title="Childcare Cost Index",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Consumer Price Index",
        series_id="CUUR0000SEEB",
        frequency="monthly",
        category="service_access",
        direction="negative",
        weight=0.25,
        units="index 1982-84=100",
        notes="Higher childcare prices make an essential service less affordable for families.",
        public_url="https://fred.stlouisfed.org/series/CUUR0000SEEB",
    ),
    SeriesDefinition(
        key="medical_care_cost_index",
        title="Medical Care Services Cost Index",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Consumer Price Index",
        series_id="CUSR0000SAM2",
        frequency="monthly",
        category="service_access",
        direction="negative",
        weight=0.25,
        units="index 1982-84=100",
        notes="Higher medical-care prices make healthcare less affordable for households.",
        public_url="https://fred.stlouisfed.org/series/CUSR0000SAM2",
    ),
    SeriesDefinition(
        key="childcare_employment",
        title="Childcare Services Employment",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Current Employment Statistics",
        series_id="CES6562440001",
        frequency="monthly",
        category="service_access",
        direction="positive",
        weight=0.25,
        units="thousands of persons",
        notes="Higher childcare employment is a provider-capacity proxy for family access.",
        public_url="https://fred.stlouisfed.org/series/CES6562440001",
    ),
    SeriesDefinition(
        key="healthcare_social_assistance_employment",
        title="Healthcare and Social Assistance Employment",
        source="U.S. Bureau of Labor Statistics via FRED",
        dataset="Current Employment Statistics",
        series_id="CES6562000001",
        frequency="monthly",
        category="service_access",
        direction="positive",
        weight=0.25,
        units="thousands of persons",
        notes=(
            "Higher healthcare and social-assistance employment is a provider-capacity proxy "
            "for household access."
        ),
        public_url="https://fred.stlouisfed.org/series/CES6562000001",
    ),
)

GROUP_WEIGHTS: dict[str, float] = {
    "financial_resilience": 0.35,
    "labor_opportunity": 0.30,
    "household_strain": 0.15,
    "service_access": 0.20,
}

METHODOLOGY = {
    "title": "Household Opportunity & Stress Index (HOSI)",
    "baseline_year": 2019,
    "scoring": (
        "Each source series is normalized so its 2019 average equals 100. For "
        "stress-oriented series, score = current_value / 2019_average * 100. For "
        "opportunity or resilience series where higher values are better, score = "
        "2019_average / current_value * 100. Higher HOSI always means more stress."
    ),
    "aggregation": {
        "component_level": (
            "Weighted mean within each component group using the configured series weights."
        ),
        "index_level": "Weighted mean of component groups using fixed group weights.",
    },
    "caveats": [
        "HOSI is experimental and not an official government statistic.",
        (
            "Service-access stress combines childcare and medical-care prices with provider "
            "employment as a capacity proxy; it does not yet include direct wait-time or "
            "unmet-need survey data."
        ),
        (
            "The housing affordability input uses a reproducible official proxy "
            "because the current FRED-hosted NAR fixed HAI window is too short for "
            "a 2019 baseline workflow."
        ),
        (
            "Quarterly series are forward-filled to monthly cadence after release "
            "dates to support a unified monthly dashboard."
        ),
    ],
}
