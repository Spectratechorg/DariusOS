from app.modules.intake.validator import ValidationResult
from app.schemas.survey import IntakeQualityReport, QualityVerdict


class IntakeReportGenerator:
    """
    Generates plain-language executive reports of survey point intake quality.
    """

    @classmethod
    def generate(
        cls,
        filename: str,
        sha256_hash: str,
        file_size_bytes: int,
        validation: ValidationResult,
        crs_epsg: int = 32632
    ) -> IntakeQualityReport:
        b = validation.bounds

        status_headline = {
            QualityVerdict.PASSED: "SURVEY FILE ACCEPTED: Survey data is clean, well-distributed, and ready for terrain modeling.",
            QualityVerdict.PASSED_WITH_WARNINGS: "SURVEY FILE ACCEPTED WITH WARNINGS: Data contains minor anomalies that were automatically normalized.",
            QualityVerdict.REJECTED: "SURVEY FILE REJECTED: Survey file does not meet minimum quality criteria for road design."
        }[validation.verdict]

        summary_lines = [
            f"--- SURVEY INTAKE REPORT: {filename} ---",
            status_headline,
            f"File Signature: SHA-256 {sha256_hash[:16]}... ({file_size_bytes / 1024:.1f} KB)",
            f"Point Count: {validation.total_raw_points:,} raw points read -> {validation.valid_points_count:,} valid points retained.",
            f"Survey Extents: Easting [{b.min_x:.1f}m to {b.max_x:.1f}m], Northing [{b.min_y:.1f}m to {b.max_y:.1f}m], Elevation [{b.min_z:.2f}m to {b.max_z:.2f}m].",
            f"Corridor Dimensions: Width: {b.span_x:.1f} m, Length: {b.span_y:.1f} m, Elevation Delta: {b.span_z:.2f} m.",
            f"Average Point Density: {validation.density_pts_m2:.2f} points/m² (approx area: {b.approximate_area_m2:,.0f} m²).",
        ]

        # Anomaly cleaning details
        cleaning_details = []
        if validation.duplicate_indices:
            cleaning_details.append(f"{len(validation.duplicate_indices)} duplicate points removed")
        if validation.spike_indices:
            cleaning_details.append(f"{len(validation.spike_indices)} planted elevation spikes isolated")
        if validation.hole_indices:
            cleaning_details.append(f"{len(validation.hole_indices)} planted elevation holes isolated")
        if validation.nan_or_inf_indices:
            cleaning_details.append(f"{len(validation.nan_or_inf_indices)} invalid/blank coordinate rows dropped")

        if cleaning_details:
            summary_lines.append("Cleaning Actions: " + ", ".join(cleaning_details) + ".")
        else:
            summary_lines.append("Cleaning Actions: No anomalies detected; dataset was 100% clean.")

        if validation.warnings:
            summary_lines.append("Engineering Warnings:")
            for w in validation.warnings:
                summary_lines.append(f"  - [WARNING] {w}")

        if validation.errors:
            summary_lines.append("Rejection Errors:")
            for e in validation.errors:
                summary_lines.append(f"  - [ERROR] {e}")

        summary_lines.append(
            "Notice: Quality assessment completed for preliminary decision support. "
            "All coordinate systems and data bounds to be confirmed by a registered engineer."
        )

        plain_text_summary = "\n".join(summary_lines)

        return IntakeQualityReport(
            verdict=validation.verdict,
            total_raw_points=validation.total_raw_points,
            valid_points=validation.valid_points_count,
            duplicate_count=len(validation.duplicate_indices),
            blank_or_nan_count=len(validation.nan_or_inf_indices),
            spikes_count=len(validation.spike_indices),
            holes_count=len(validation.hole_indices),
            density_pts_m2=validation.density_pts_m2,
            bounds=b,
            crs_epsg=crs_epsg,
            warnings=validation.warnings,
            errors=validation.errors,
            summary_text=plain_text_summary
        )
