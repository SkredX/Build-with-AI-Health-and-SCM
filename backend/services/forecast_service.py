import numpy as np
from scipy.stats import norm
from models.database import db

class ForecastService:
    def forecast_demand(self, district_id: str, drug_code: str, horizon_days: int) -> list[float]:
        # Simple statistical model: baseline + trend + seasonality (dummy implementation)
        # Using numpy/scipy concepts conceptually
        base = 100 if drug_code == "ORS" else 50
        
        # Indian disease seasonality (e.g., monsoon cholera)
        time_index = np.arange(horizon_days)
        seasonality = 20 * np.sin(2 * np.pi * time_index / 365) # mock seasonality
        trend = 0.5 * time_index
        noise = np.random.normal(0, 5, horizon_days)
        
        forecast = np.maximum(0, base + trend + seasonality + noise)
        return forecast.tolist()
        
    def predict_stockout(self, phc_id: str, drug_code: str) -> float:
        inventory = db.get_inventory(phc_id)
        if drug_code not in inventory:
            return 0.0
        
        stock = inventory[drug_code]["quantity"]
        # Assume consumption rate
        consumption_rate = 5.0 # items per day
        if consumption_rate > 0:
            return stock / consumption_rate
        return 999.0

    def detect_anomaly(self, district_id: str) -> float:
        # Returns anomaly score based on recent case spikes vs baseline
        df = db.get_disease_patterns()
        recent = df.tail(7)['cases'].mean()
        baseline = df['cases'].mean()
        
        if baseline == 0:
            return 0.0
        return (recent - baseline) / baseline
