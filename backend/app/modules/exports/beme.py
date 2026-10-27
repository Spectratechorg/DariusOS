from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Tuple
import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

from app import __version__
from app.core.config import settings
from app.core.engineering import get_engineering_rules
from app.schemas.alignment import HorizontalAlignmentPackage
from app.schemas.cross_section import CrossSectionPackage
from app.schemas.exports import BemeExportData, BemeItem
from app.schemas.quantities import EarthworkQuantitiesPackage


class BemeExporter:
    """
    Generates an Excel Bill of Engineering Measurement and Evaluation (BEME)
    using openpyxl, featuring active spreadsheet formulas and registered engineer banners.
    """

    @classmethod
    def generate_excel(
        cls,
        project_name: str,
        survey_sha256: str,
        rules_sha256: str,
        alignment: HorizontalAlignmentPackage,
        cross_sections: CrossSectionPackage,
        quantities: EarthworkQuantitiesPackage,
        output_filename: Optional[str] = None
    ) -> BemeExportData:
        rules = get_engineering_rules()
        beme_rules = rules.beme_rates_placeholder
        currency = beme_rules.get("currency", "USD")
        raw_items = beme_rules.get("items", [])

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Bill of Quantities (BEME)"
        ws.views.sheetView[0].showGridLines = True

        # Styles
        font_title = Font(name="Calibri", size=14, bold=True, color="1F497D")
        font_disclaimer = Font(name="Calibri", size=11, bold=True, color="C00000")
        font_meta = Font(name="Calibri", size=10, italic=True)
        font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        font_data = Font(name="Calibri", size=11)
        font_total = Font(name="Calibri", size=11, bold=True)

        fill_header = PatternFill(start_color="1F497D", end_color="1F497D", fill_type="solid")
        fill_total = PatternFill(start_color="DCE6F1", end_color="DCE6F1", fill_type="solid")
        fill_banner = PatternFill(start_color="FDE9D9", end_color="FDE9D9", fill_type="solid")

        thin_border_side = Side(border_style="thin", color="D9D9D9")
        thin_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
        total_top_border = Side(border_style="thin", color="000000")
        total_bottom_border = Side(border_style="double", color="000000")
        border_total = Border(top=total_top_border, bottom=total_bottom_border)

        # 1. Header Banner & Engineer Disclaimer
        ws.merge_cells("A1:F1")
        cell_banner = ws["A1"]
        cell_banner.value = "TO BE CONFIRMED BY A REGISTERED ENGINEER - PRELIMINARY PLACEHOLDER RATES"
        cell_banner.font = font_disclaimer
        cell_banner.fill = fill_banner
        cell_banner.alignment = Alignment(horizontal="center", vertical="center")

        ws.cell(row=3, column=1, value=f"Project: {project_name}").font = font_title
        ws.cell(row=4, column=1, value=f"Platform: Dariusos v{__version__} | Date: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}").font = font_meta
        ws.cell(row=5, column=1, value=f"Input Survey SHA-256: {survey_sha256[:16]}... | Rules SHA-256: {rules_sha256[:16]}...").font = font_meta

        # 2. Table Column Headers
        headers = ["Item No.", "Description of Work", "Unit", "Quantity", f"Unit Rate ({currency})", f"Amount ({currency})"]
        header_row = 7

        for col_idx, header_text in enumerate(headers, start=1):
            cell = ws.cell(row=header_row, column=col_idx, value=header_text)
            cell.font = font_header
            cell.fill = fill_header
            cell.alignment = Alignment(horizontal="center" if col_idx in [1, 3] else "left" if col_idx == 2 else "right", vertical="center")

        # 3. Derive Quantities from Single Source of Truth
        # Total corridor footprint area (approx topsoil strip)
        footprint_area_m2 = sum(sec.topsoil_strip_width_m * alignment.station_interval_m for sec in cross_sections.sections)
        wearing_course_area_m2 = cross_sections.carriageway_width_m * alignment.total_length_m
        subbase_vol_m3 = wearing_course_area_m2 * 0.150  # 150mm standard subbase

        # Drainage ditch length (sum of intervals in cut)
        drain_len_m = sum(inv.distance_m for inv in quantities.intervals if inv.incremental_cut_m3 > 0)

        quantity_map = {
            "1.01": footprint_area_m2,
            "1.02": quantities.total_topsoil_strip_volume_m3,
            "2.01": quantities.total_cut_volume_m3,
            "2.02": quantities.factored_fill_volume_m3,
            "3.01": subbase_vol_m3,
            "3.02": wearing_course_area_m2,
            "4.01": drain_len_m
        }

        beme_items: List[BemeItem] = []
        current_row = 8

        for item_def in raw_items:
            code = item_def.get("code", "")
            desc = item_def.get("description", "")
            unit = item_def.get("unit", "")
            rate = float(item_def.get("unit_rate", 0.0))
            qty = float(quantity_map.get(code, 100.0))
            amount = round(qty * rate, 2)

            # Write row
            c_code = ws.cell(row=current_row, column=1, value=code)
            c_desc = ws.cell(row=current_row, column=2, value=desc)
            c_unit = ws.cell(row=current_row, column=3, value=unit)
            c_qty = ws.cell(row=current_row, column=4, value=round(qty, 2))
            c_rate = ws.cell(row=current_row, column=5, value=rate)
            c_amt = ws.cell(row=current_row, column=6, value=f"=D{current_row}*E{current_row}")

            c_code.alignment = Alignment(horizontal="center")
            c_desc.alignment = Alignment(horizontal="left")
            c_unit.alignment = Alignment(horizontal="center")
            c_qty.alignment = Alignment(horizontal="right")
            c_rate.alignment = Alignment(horizontal="right")
            c_amt.alignment = Alignment(horizontal="right")

            c_qty.number_format = "#,##0.00"
            c_rate.number_format = "#,##0.00"
            c_amt.number_format = "#,##0.00"

            for c in [c_code, c_desc, c_unit, c_qty, c_rate, c_amt]:
                c.font = font_data
                c.border = thin_border

            beme_items.append(
                BemeItem(
                    item_code=code,
                    description=desc,
                    unit=unit,
                    quantity=round(qty, 2),
                    unit_rate=rate,
                    amount=amount
                )
            )
            current_row += 1

        # 4. Total Row with SUM Formula
        total_row = current_row
        ws.cell(row=total_row, column=2, value="GRAND TOTAL ESTIMATED COST").font = font_total
        ws.cell(row=total_row, column=2).alignment = Alignment(horizontal="right")
        ws.cell(row=total_row, column=2).fill = fill_total

        total_cell = ws.cell(row=total_row, column=6, value=f"=SUM(F8:F{total_row - 1})")
        total_cell.font = font_total
        total_cell.fill = fill_total
        total_cell.alignment = Alignment(horizontal="right")
        total_cell.number_format = "#,##0.00"
        total_cell.border = border_total

        grand_total = sum(item.amount for item in beme_items)

        # Auto-fit column widths
        col_paddings = {1: 12, 2: 55, 3: 10, 4: 16, 5: 16, 6: 18}
        for col_idx, width in col_paddings.items():
            ws.column_dimensions[get_column_letter(col_idx)].width = width

        # 5. Save workbook
        processed_dir = Path(settings.PROCESSED_DIR)
        processed_dir.mkdir(parents=True, exist_ok=True)
        fname = output_filename or f"{survey_sha256[:12]}_BEME.xlsx"
        file_path = processed_dir / fname
        wb.save(file_path)

        return BemeExportData(
            project_title=project_name,
            currency=currency,
            generated_at=datetime.now(timezone.utc).isoformat(),
            code_version=__version__,
            survey_sha256=survey_sha256,
            rules_sha256=rules_sha256,
            items=beme_items,
            grand_total_estimated=round(grand_total, 2),
            excel_file_path=str(file_path)
        )
