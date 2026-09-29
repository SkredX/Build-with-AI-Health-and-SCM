from fastapi import APIRouter
from models.database import db

router = APIRouter()

@router.get("/geojson/{state}")
def get_geojson(state: str, include_outbreaks: bool = False):
    phcs = [p for p in db.get_phcs() if p["state"] == state]
    
    features = []
    for phc in phcs:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [phc["lon"], phc["lat"]]
            },
            "properties": {
                "phc_id": phc["phc_id"],
                "name": phc["name"],
                "district_id": phc["district_id"]
            }
        }
        features.append(feature)
        
    if include_outbreaks:
        # Dummy outbreak polygon
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[75.0, 26.0], [76.0, 26.0], [76.0, 27.0], [75.0, 27.0], [75.0, 26.0]]]
            },
            "properties": {
                "hazard_type": "Cholera",
                "severity": "High"
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }
