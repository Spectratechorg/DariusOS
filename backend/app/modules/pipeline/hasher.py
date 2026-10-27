import hashlib
import json
from typing import Any, Dict


def compute_cache_key(stage_name: str, payload: Dict[str, Any]) -> str:
    """
    Computes a deterministic SHA-256 cache key from a dictionary payload.
    Sorts dictionary keys to guarantee reproducibility across runs and environments.
    """
    serialized = json.dumps(payload, sort_keys=True, default=str)
    raw_key = f"{stage_name}:{serialized}"
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
