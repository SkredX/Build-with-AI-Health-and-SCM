from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class TriageRequest(BaseModel):
    patient_id: str
    patient_name: str
    age: int
    gender: str
    phc_name: str
    vitals: Dict[str, Any]
    input_text: str
    input_mode: str
    image_base64: Optional[str] = None

class TriageResponse(BaseModel):
    condition: str
    snomed_code: str
    urgency: str
    confidence: float
    symptoms: List[str]
    medicines: List[str]
    guidance_hi: str
    guidance_en: str
    guidance_regional: Dict[str, str]
    deductions: Dict[str, Any]
    prognosis: Optional[str] = None

class ForecastRequest(BaseModel):
    district_id: str
    drug_code: str
    horizon_days: int = 30

class ForecastResponse(BaseModel):
    district_id: str
    drug_code: str
    predicted_demand: List[float]
    stockout_date: Optional[str]
    confidence_interval: List[List[float]]

class Transfer(BaseModel):
    source_phc: str
    dest_phc: str
    quantity: int
    priority: str

class RedistributionRequest(BaseModel):
    district_id: str
    drug_code: str

class RedistributionResponse(BaseModel):
    transfers: List[Transfer]

class Alert(BaseModel):
    phc_id: str
    drug: str
    current_stock: int
    predicted_stockout_days: int
    severity: str

class AlertResponse(BaseModel):
    alerts: List[Alert]

class InventoryItem(BaseModel):
    drug_code: str
    drug_name: str
    quantity: int
    batch_number: str
    expiry_date: str

class PHCInfo(BaseModel):
    phc_id: str
    name: str
    district_id: str
    state: str
    lat: float
    lon: float

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: Dict[str, Any]

class FHIRBundleRequest(BaseModel):
    patient_id: str
    patient_name: str
    gender: str
    birth_date: str
    condition_code: str
    condition_display: str

class FHIRBundleResponse(BaseModel):
    bundle: Dict[str, Any]
