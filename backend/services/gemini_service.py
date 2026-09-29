import google.generativeai as genai
from config import settings
from models.schemas import TriageRequest, TriageResponse
import json
import asyncio

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.MODEL_NAME)
        self.system_prompt = """
        You are an expert AI clinical triage assistant for the National Health Mission (NHM).
        Analyze the patient's vitals, text input, and symptoms.
        Return a JSON response conforming strictly to this format:
        {
          "condition": "Condition name",
          "snomed_code": "SNOMED code",
          "urgency": "Low|Medium|High|Critical",
          "confidence": 0.9,
          "symptoms": ["Symptom 1", "Symptom 2"],
          "medicines": ["Med 1", "Med 2"],
          "guidance_hi": "Hindi guidance",
          "guidance_en": "English guidance",
          "guidance_regional": {"lang": "Guidance"},
          "deductions": {"key": "value"}
        }
        """

    async def triage_patient(self, request: TriageRequest) -> TriageResponse:
        prompt = f"{self.system_prompt}\nPatient Input: {request.input_text}\nVitals: {request.vitals}"
        
        # Simulating async operation with timeout
        try:
            loop = asyncio.get_event_loop()
            response = await asyncio.wait_for(
                loop.run_in_executor(None, lambda: self.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})),
                timeout=10.0
            )
            data = json.loads(response.text)
            return TriageResponse(**data)
        except Exception as e:
            raise RuntimeError(f"Gemini call failed: {e}")

    async def analyze_prescription_image(self, image_base64: str, patient_context: str):
        # Multimodal dummy
        return {"extracted_medicines": ["Paracetamol"], "confidence": 0.8}
