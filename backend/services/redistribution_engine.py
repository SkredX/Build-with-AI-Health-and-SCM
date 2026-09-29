from scipy.optimize import linprog
import math
from models.database import db
from models.schemas import Transfer

class RedistributionEngine:
    def _haversine(self, lat1, lon1, lat2, lon2):
        R = 6371 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    def optimize_transfers(self, district_id: str, drug_code: str) -> list[Transfer]:
        phcs = [p for p in db.get_phcs() if p["district_id"] == district_id]
        if len(phcs) < 2:
            return []
            
        inventory = db.get_inventory()
        safety_stock = 50
        
        surplus_phcs = []
        deficit_phcs = []
        
        for p in phcs:
            pid = p["phc_id"]
            stock = inventory.get(pid, {}).get(drug_code, {}).get("quantity", 0)
            if stock > safety_stock + 20:
                surplus_phcs.append({"id": pid, "surplus": stock - safety_stock, "lat": p["lat"], "lon": p["lon"]})
            elif stock < safety_stock - 10:
                deficit_phcs.append({"id": pid, "deficit": safety_stock - stock, "lat": p["lat"], "lon": p["lon"]})
                
        if not surplus_phcs or not deficit_phcs:
            return []
            
        # Simplified linear programming formulation (greedy fallback for simplicity here)
        transfers = []
        for d in deficit_phcs:
            for s in surplus_phcs:
                if d["deficit"] > 0 and s["surplus"] > 0:
                    dist = self._haversine(s["lat"], s["lon"], d["lat"], d["lon"])
                    transfer_qty = min(d["deficit"], s["surplus"])
                    
                    if transfer_qty > 0:
                        transfers.append(Transfer(
                            source_phc=s["id"],
                            dest_phc=d["id"],
                            quantity=transfer_qty,
                            priority="High" if d["deficit"] > 30 else "Medium"
                        ))
                        d["deficit"] -= transfer_qty
                        s["surplus"] -= transfer_qty
                        
        return transfers
