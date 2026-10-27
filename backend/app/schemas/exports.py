from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class BemeItem(BaseModel):
    item_code: str
    description: str
    unit: str
    quantity: float
    unit_rate: float
    amount: float


class BemeExportData(BaseModel):
    project_title: str
    currency: str = "USD"
    generated_at: str
    code_version: str
    survey_sha256: str
    rules_sha256: str
    items: List[BemeItem] = Field(default_factory=list)
    grand_total_estimated: float
    excel_file_path: Optional[str] = None
    engineer_notice: str = "PRELIMINARY DEMO RATES - ALL QUANTITIES AND RATES TO BE CONFIRMED BY A REGISTERED ENGINEER"


class AccuracyCheck(BaseModel):
    benchmark_name: str
    theoretical_value: float
    computed_value: float
    unit: str
    discrepancy_percent: float
    passed: bool


class PilotReportData(BaseModel):
    project_title: str
    project_id: str
    generated_at: str
    code_version: str
    survey_filename: str
    survey_sha256: str
    rules_sha256: str
    total_survey_points: int
    corridor_length_m: float
    corridor_width_m: float
    station_interval_m: float
    total_stations: int
    max_ground_grade_percent: float
    max_design_grade_percent: float
    total_cut_m3: float
    total_fill_m3: float
    factored_fill_m3: float
    net_earthwork_m3: float
    mass_haul_balance: str
    total_estimated_cost_usd: float
    pipeline_duration_seconds: float
    accuracy_benchmarks: List[AccuracyCheck] = Field(default_factory=list)
    pdf_file_path: Optional[str] = None
    engineer_disclaimer: str = (
        "CRITICAL ENGINEERING NOTICE: THIS REPORT REPRESENTS PRELIMINARY AUTOMATED DECISION SUPPORT. "
        "ALL GEOMETRIES, QUANTITIES, SOIL FACTORS, AND UNIT RATES MUST BE CONFIRMED, STAMPED, AND CERTIFIED "
        "BY A REGISTERED PROFESSIONAL CIVIL ENGINEER PRIOR TO BIDDING OR CONSTRUCTION."
    )
