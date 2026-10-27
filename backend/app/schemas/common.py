from typing import Any, Dict, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class ApiResponse(BaseModel, Generic[DataT]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[DataT] = None
    engineer_notice: str = "TO BE CONFIRMED BY A REGISTERED ENGINEER"


class HealthCheck(BaseModel):
    status: str = "healthy"
    version: str = "0.1.0-mvp"
    environment: str = "development"
    engineer_disclaimer: str = "ALL GEOMETRY & RATES TO BE CONFIRMED BY A REGISTERED ENGINEER"
    rules_sha256: str
