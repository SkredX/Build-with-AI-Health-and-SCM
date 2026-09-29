from fastapi import APIRouter
from models.schemas import AlertResponse, Alert
from models.database import db
from services.forecast_service import ForecastService

router = APIRouter()
forecast_service = ForecastService()

@router.get("/alerts", response_model=AlertResponse)
def get_alerts(state: str = None):
    phcs = db.get_phcs()
    if state:
        phcs = [p for p in phcs if p["state"] == state]
    
    alerts = []
    inventory = db.get_inventory()
    
    for phc in phcs:
        phc_inv = inventory.get(phc["phc_id"], {})
        for drug_code, data in phc_inv.items():
            stock = data["quantity"]
            days_to_stockout = forecast_service.predict_stockout(phc["phc_id"], drug_code)
            
            if days_to_stockout <= 14:
                severity = "Critical" if days_to_stockout <= 3 else "Warning"
                alerts.append(Alert(
                    phc_id=phc["phc_id"],
                    drug=drug_code,
                    current_stock=stock,
                    predicted_stockout_days=int(days_to_stockout),
                    severity=severity
                ))
                
    return AlertResponse(alerts=alerts)
