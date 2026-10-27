import hashlib
import json
import logging
from pathlib import Path
from typing import Any, Dict, List
from pydantic import BaseModel, Field

from app.core.config import settings

logger = logging.getLogger("dariusos.engineering")

MANDATORY_DISCLAIMER_KEYWORD = "TO BE CONFIRMED BY A REGISTERED ENGINEER"


class BemeItemRate(BaseModel):
    code: str
    description: str
    unit: str
    unit_rate: float


class EngineeringRules(BaseModel):
    ENGINEERING_STATUS: str
    disclaimer: str
    project_metadata: Dict[str, Any]
    horizontal_alignment: Dict[str, Any]
    vertical_alignment: Dict[str, Any]
    cross_section: Dict[str, Any]
    earthwork_factors: Dict[str, Any]
    beme_rates_placeholder: Dict[str, Any]


class EngineeringRulesLoader:
    """
    Safely loads and caches the engineering configuration.
    Enforces that all engineering rules are clearly flagged with the registered engineer disclaimer.
    """
    _cached_rules: EngineeringRules | None = None
    _cached_raw_dict: Dict[str, Any] | None = None
    _cached_sha256: str | None = None

    @classmethod
    def load(cls, force_reload: bool = False) -> EngineeringRules:
        if cls._cached_rules is not None and not force_reload:
            return cls._cached_rules

        path = Path(settings.ENGINEERING_RULES_PATH)
        if not path.is_file():
            raise FileNotFoundError(
                f"CRITICAL: Engineering rules file not found at: {path}. "
                "Engineering values cannot be assumed or invented!"
            )

        raw_bytes = path.read_bytes()
        sha256_hash = hashlib.sha256(raw_bytes).hexdigest()
        raw_dict = json.loads(raw_bytes.decode("utf-8"))

        # Verify mandatory registered engineer notice
        status_text = raw_dict.get("ENGINEERING_STATUS", "")
        if MANDATORY_DISCLAIMER_KEYWORD not in status_text:
            raise ValueError(
                f"CRITICAL: Engineering rules file must be marked '{MANDATORY_DISCLAIMER_KEYWORD}'."
            )

        parsed = EngineeringRules(**raw_dict)
        cls._cached_rules = parsed
        cls._cached_raw_dict = raw_dict
        cls._cached_sha256 = sha256_hash

        logger.info(
            "Loaded Engineering Rules (SHA-256: %s). Notice: %s",
            sha256_hash[:12],
            parsed.ENGINEERING_STATUS
        )
        return parsed

    @classmethod
    def get_raw_dict(cls) -> Dict[str, Any]:
        if cls._cached_raw_dict is None:
            cls.load()
        return cls._cached_raw_dict  # type: ignore

    @classmethod
    def get_sha256(cls) -> str:
        if cls._cached_sha256 is None:
            cls.load()
        return cls._cached_sha256  # type: ignore


def get_engineering_rules() -> EngineeringRules:
    return EngineeringRulesLoader.load()
