from fastapi import APIRouter
from models.schemas import FHIRBundleRequest, FHIRBundleResponse
import uuid

router = APIRouter()

@router.post("/fhir/bundle", response_model=FHIRBundleResponse)
def generate_fhir_bundle(request: FHIRBundleRequest):
    bundle_id = str(uuid.uuid4())
    patient_id = str(uuid.uuid4())
    condition_id = str(uuid.uuid4())
    
    bundle = {
        "resourceType": "Bundle",
        "id": bundle_id,
        "type": "collection",
        "entry": [
            {
                "fullUrl": f"urn:uuid:{patient_id}",
                "resource": {
                    "resourceType": "Patient",
                    "id": patient_id,
                    "name": [{"text": request.patient_name}],
                    "gender": request.gender,
                    "birthDate": request.birth_date
                }
            },
            {
                "fullUrl": f"urn:uuid:{condition_id}",
                "resource": {
                    "resourceType": "Condition",
                    "id": condition_id,
                    "subject": {"reference": f"urn:uuid:{patient_id}"},
                    "code": {
                        "coding": [
                            {
                                "system": "http://snomed.info/sct",
                                "code": request.condition_code,
                                "display": request.condition_display
                            }
                        ]
                    }
                }
            }
        ]
    }
    
    return FHIRBundleResponse(bundle=bundle)
