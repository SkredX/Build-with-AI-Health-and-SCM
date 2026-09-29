import pandas as pd
from typing import List, Dict, Any
import os

class DataStore:
    def __init__(self):
        self.phcs = []
        self.inventory = {}
        self.disease_patterns = pd.DataFrame()
        self._load_mock_data()

    def _load_mock_data(self):
        # We simulate loading from CSVs since data/seed might not exist
        self.phcs = [
            {"phc_id": "P1", "name": "PHC Jaipur North", "district_id": "D1", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873},
            {"phc_id": "P2", "name": "PHC Jaipur South", "district_id": "D1", "state": "Rajasthan", "lat": 26.85, "lon": 75.8},
            {"phc_id": "P3", "name": "PHC Jodhpur Central", "district_id": "D2", "state": "Rajasthan", "lat": 26.2389, "lon": 73.0243}
        ]
        self.inventory = {
            "P1": {"ORS": {"quantity": 100, "batch_number": "B1", "expiry_date": "2025-01-01"}, "PCM": {"quantity": 500, "batch_number": "B2", "expiry_date": "2026-01-01"}},
            "P2": {"ORS": {"quantity": 500, "batch_number": "B1", "expiry_date": "2025-01-01"}, "PCM": {"quantity": 50, "batch_number": "B2", "expiry_date": "2026-01-01"}},
            "P3": {"ORS": {"quantity": 20, "batch_number": "B1", "expiry_date": "2025-01-01"}, "PCM": {"quantity": 20, "batch_number": "B2", "expiry_date": "2026-01-01"}}
        }
        dates = pd.date_range(start='2023-01-01', end='2023-12-31')
        self.disease_patterns = pd.DataFrame({'date': dates, 'cases': [10]*len(dates)})

    def get_phcs(self) -> List[Dict[str, Any]]:
        return self.phcs
    
    def get_inventory(self, phc_id: str = None) -> Dict[str, Any]:
        if phc_id:
            return self.inventory.get(phc_id, {})
        return self.inventory

    def update_stock(self, phc_id: str, drug_code: str, quantity: int):
        if phc_id not in self.inventory:
            self.inventory[phc_id] = {}
        if drug_code not in self.inventory[phc_id]:
            self.inventory[phc_id][drug_code] = {"quantity": 0, "batch_number": "NEW", "expiry_date": "2099-12-31"}
        self.inventory[phc_id][drug_code]["quantity"] = quantity

    def get_disease_patterns(self) -> pd.DataFrame:
        return self.disease_patterns

db = DataStore()
