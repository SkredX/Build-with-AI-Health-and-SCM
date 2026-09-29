from fastapi import APIRouter
from models.schemas import RedistributionRequest, RedistributionResponse
from services.redistribution_engine import RedistributionEngine

router = APIRouter()
engine = RedistributionEngine()

@router.post("/redistribution", response_model=RedistributionResponse)
def compute_redistribution(request: RedistributionRequest):
    transfers = engine.optimize_transfers(request.district_id, request.drug_code)
    return RedistributionResponse(transfers=transfers)
