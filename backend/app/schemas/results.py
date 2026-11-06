from typing import List, Optional
from pydantic import BaseModel, Field


class BemeRowItemSchema(BaseModel):
    code: str
    description: str
    unit: str
    quantity: float
    unitRate: float
    amount: float


class BemeCategorySchema(BaseModel):
    categoryCode: str
    categoryName: str
    items: List[BemeRowItemSchema]
    subtotal: float


class BemeJsonResponse(BaseModel):
    project_title: str
    currency: str = "NGN"
    engineer_disclaimer: str = (
        "TO BE CONFIRMED BY A REGISTERED ENGINEER - PRELIMINARY PLACEHOLDER RATES"
    )
    grand_total: float
    categories: List[BemeCategorySchema]


class SlopeDistributionItem(BaseModel):
    label: str
    percentage: float


class TerrainSummaryResponse(BaseModel):
    surveyPointsUsed: int
    tinTriangles: int
    lowestGroundM: float
    highestGroundM: float
    meanSlopePercent: float
    classification: str
    slopeDistribution: List[SlopeDistributionItem]
    engineer_disclaimer: str = (
        "TERRAIN SURFACE MODEL GENERATED - TO BE CONFIRMED BY A REGISTERED ENGINEER"
    )
