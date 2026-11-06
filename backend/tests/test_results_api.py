import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.project import Project
from app.models.pipeline_run import PipelineRun
from app.core.database import SessionLocal


def test_beme_and_terrain_endpoints():
    client = TestClient(app)
    db = SessionLocal()
    try:
        # Fetch the seeded completed run
        run = db.query(PipelineRun).filter(PipelineRun.status == "COMPLETED").first()
        assert run is not None, "Completed pipeline run must exist from seeding"
        run_id = run.id

        # 1. Test BEME endpoint
        response_beme = client.get(f"/api/v1/runs/{run_id}/beme")
        assert response_beme.status_code == 200, f"BEME endpoint failed: {response_beme.text}"
        data_beme = response_beme.json()
        assert "categories" in data_beme
        assert "grand_total" in data_beme
        assert data_beme["currency"] == "NGN"
        assert len(data_beme["categories"]) == 4
        assert data_beme["grand_total"] > 0
        assert "TO BE CONFIRMED BY A REGISTERED ENGINEER" in data_beme["engineer_disclaimer"]

        # Verify category items
        for cat in data_beme["categories"]:
            assert "categoryCode" in cat
            assert "categoryName" in cat
            assert "items" in cat
            assert "subtotal" in cat
            assert len(cat["items"]) > 0
            for item in cat["items"]:
                assert "code" in item
                assert "description" in item
                assert "unit" in item
                assert "quantity" in item
                assert "unitRate" in item
                assert "amount" in item
                assert item["amount"] == pytest.approx(item["quantity"] * item["unitRate"], rel=1e-2)

        # 2. Test Terrain endpoint
        response_terrain = client.get(f"/api/v1/runs/{run_id}/terrain")
        assert response_terrain.status_code == 200, f"Terrain endpoint failed: {response_terrain.text}"
        data_terrain = response_terrain.json()
        assert "surveyPointsUsed" in data_terrain
        assert data_terrain["surveyPointsUsed"] > 0
        assert "tinTriangles" in data_terrain
        assert "lowestGroundM" in data_terrain
        assert "highestGroundM" in data_terrain
        assert "meanSlopePercent" in data_terrain
        assert "classification" in data_terrain
        assert "slopeDistribution" in data_terrain
        assert len(data_terrain["slopeDistribution"]) == 4
    finally:
        db.close()
