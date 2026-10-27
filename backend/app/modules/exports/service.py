"""Exports service orchestrating Excel BEME and Pilot PDF report generation."""
from typing import Optional
from sqlalchemy.orm import Session

from app.core.audit import record_audit_event
from app.modules.exports.beme import BemeExporter
from app.modules.exports.pilot_report import PilotReportExporter
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.exports import BemeExportData, PilotReportData
from app.schemas.quantities import EarthworkQuantitiesPackage


class ExportsService:
    """Service to coordinate and log exports of BEME and Pilot Reports."""

    @classmethod
    def generate_beme(
        cls,
        project_name: str,
        survey_sha256: str,
        rules_sha256: str,
        alignment: HorizontalAlignmentPackage,
        cross_sections: CrossSectionPackage,
        quantities: EarthworkQuantitiesPackage,
        output_filename: Optional[str] = None,
        db: Optional[Session] = None,
        user_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> BemeExportData:
        beme_data = BemeExporter.generate_excel(
            project_name=project_name,
            survey_sha256=survey_sha256,
            rules_sha256=rules_sha256,
            alignment=alignment,
            cross_sections=cross_sections,
            quantities=quantities,
            output_filename=output_filename
        )
        if db is not None:
            record_audit_event(
                db=db,
                action="EXPORT_BEME",
                user_id=user_id,
                resource_type="project",
                resource_id=project_id,
                details={
                    "project_name": project_name,
                    "survey_sha256": survey_sha256,
                    "file_path": beme_data.excel_file_path,
                    "total_items": len(beme_data.items),
                    "grand_total": beme_data.grand_total_estimated
                }
            )
        return beme_data

    @classmethod
    def generate_pilot_report(
        cls,
        report_data: PilotReportData,
        output_filename: Optional[str] = None,
        db: Optional[Session] = None,
        user_id: Optional[str] = None
    ) -> str:
        pdf_path = PilotReportExporter.generate_pdf(
            report_data=report_data,
            output_filename=output_filename
        )
        report_data.pdf_file_path = pdf_path
        if db is not None:
            record_audit_event(
                db=db,
                action="EXPORT_PILOT_REPORT",
                user_id=user_id,
                resource_type="project",
                resource_id=report_data.project_id,
                details={
                    "project_id": report_data.project_id,
                    "project_title": report_data.project_title,
                    "file_path": pdf_path,
                    "total_stations": report_data.total_stations,
                    "total_cut_m3": report_data.total_cut_m3,
                    "total_fill_m3": report_data.total_fill_m3
                }
            )
        return pdf_path
