from typing import Tuple
import numpy as np

from app.modules.intake.validator import ValidationResult
from app.modules.intake.readers.base import POINT_DTYPE


class SurveyCleaner:
    """
    Cleans and normalizes survey points based on validation findings.
    Removes duplicates, drops non-finite records, and filters elevation spikes/holes.
    """

    @classmethod
    def clean_points(
        cls,
        raw_points: np.ndarray,
        validation: ValidationResult
    ) -> np.ndarray:
        total = len(raw_points)
        if total == 0:
            return np.empty(0, dtype=POINT_DTYPE)

        # Build mask of rejected indices
        rejected_indices = (
            validation.nan_or_inf_indices
            | validation.duplicate_indices
            | validation.spike_indices
            | validation.hole_indices
        )

        if not rejected_indices:
            return raw_points.copy()

        keep_mask = np.ones(total, dtype=bool)
        keep_mask[list(rejected_indices)] = False

        cleaned_points = raw_points[keep_mask]
        return cleaned_points
