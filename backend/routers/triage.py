from fastapi import APIRouter, HTTPException
from models.schemas import TriageRequest, TriageResponse
from services.gemini_service import GeminiService
import traceback

router = APIRouter()
gemini_service = GeminiService()

def heuristic_triage(request: TriageRequest) -> TriageResponse:
    text = request.input_text.lower()
    
    condition = "Unknown"
    urgency = "Low"
    symptoms = []
    medicines = []
    
    if "cholera" in text or "diarrhea" in text or "दस्त" in text:
        condition = "Cholera/Diarrhea"
        urgency = "High"
        symptoms = ["Diarrhea", "Dehydration"]
        medicines = ["ORS", "Zinc"]
    elif "snakebite" in text or "snake" in text or "सांप" in text:
        condition = "Snakebite"
        urgency = "Critical"
        symptoms = ["Bite marks", "Swelling"]
        medicines = ["Anti-Snake Venom"]
    elif "cough" in text or "breath" in text or "खांसी" in text:
        condition = "Respiratory Infection"
        urgency = "Medium"
        symptoms = ["Cough", "Shortness of breath"]
        medicines = ["Paracetamol", "Cough Syrup"]
    elif "fever" in text or "dengue" in text or "बुखार" in text:
        condition = "Fever/Dengue"
        urgency = "Medium"
        symptoms = ["Fever", "Body Ache"]
        medicines = ["Paracetamol"]

    return TriageResponse(
        condition=condition,
        snomed_code="SNOMED-XYZ",
        urgency=urgency,
        confidence=0.5,
        symptoms=symptoms,
        medicines=medicines,
        guidance_hi="कृपया आराम करें",
        guidance_en="Please rest",
        guidance_regional={},
        deductions={"heuristic_used": True}
    )

@router.post("/triage", response_model=TriageResponse)
async def triage(request: TriageRequest):
    try:
        response = await gemini_service.triage_patient(request)
        return response
    except Exception as e:
        print(f"Gemini API failed: {e}. Falling back to heuristic.")
        traceback.print_exc()
        return heuristic_triage(request)
