import asyncio
import json
import re
from typing import Any, Dict, List, Optional

import google.generativeai as genai

from config import settings
from models.schemas import TriageRequest, TriageResponse

# Tried in order if the configured model is retired/unknown (404 / not found).
FALLBACK_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"]

SYSTEM_PROMPT = """
You are an expert AI clinical triage assistant for India's National Health Mission (NHM),
supporting an ASHA worker at a primary health centre. Analyse the patient's vitals,
symptom description, and prescription. Reply with ONLY a JSON object (no markdown) in exactly this shape:
{
  "condition": "Condition name",
  "snomed_code": "SNOMED CT code or empty string",
  "urgency": "Low | Medium | High | Critical",
  "confidence": 0.9,
  "prognosis": "Clinical trajectory, risk assessment, and expected recovery or complications",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "medicines": ["Medicine and dose 1", "Medicine and dose 2"],
  "guidance_hi": "Short advice for the family in Hindi",
  "guidance_en": "Short advice for the family in English",
  "guidance_regional": {},
  "deductions": {}
}
Use only essential medicines available at a PHC. If unsure, prefer referral advice.
"""


def _as_list(v: Any) -> List[str]:
    if isinstance(v, list):
        return [str(x) for x in v]
    if isinstance(v, str) and v.strip():
        return [s.strip() for s in re.split(r",|\n", v) if s.strip()]
    return []


def _parse_json(text: str) -> Dict[str, Any]:
    """Models sometimes wrap JSON in markdown fences; strip them."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.I)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("Model did not return JSON")
    return json.loads(text[start : end + 1])


def _coerce(data: Dict[str, Any]) -> TriageResponse:
    """Accept slightly-off model output instead of failing validation."""
    try:
        conf = float(data.get("confidence", 0.8))
    except (TypeError, ValueError):
        conf = 0.8
    if conf > 1:  # e.g. 92 -> 0.92
        conf = conf / 100
    regional = data.get("guidance_regional")
    regional = {str(k): str(v) for k, v in regional.items()} if isinstance(regional, dict) else {}
    deductions = data.get("deductions")
    prognosis = data.get("prognosis")
    return TriageResponse(
        condition=str(data.get("condition") or "Condition not identified"),
        snomed_code=str(data.get("snomed_code") or ""),
        urgency=str(data.get("urgency") or "Medium"),
        confidence=max(0.0, min(conf, 1.0)),
        symptoms=_as_list(data.get("symptoms")),
        medicines=_as_list(data.get("medicines")),
        guidance_hi=str(data.get("guidance_hi") or ""),
        guidance_en=str(data.get("guidance_en") or ""),
        guidance_regional=regional,
        deductions=deductions if isinstance(deductions, dict) else {},
        prognosis=str(prognosis) if prognosis else None,
    )


class GeminiService:
    def __init__(self):
        self._configured = False
        self.system_prompt = SYSTEM_PROMPT

    def _configure(self):
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set on the backend")
        if not self._configured:
            # REST transport is more reliable than gRPC on serverless hosts.
            genai.configure(api_key=settings.GEMINI_API_KEY, transport="rest")
            self._configured = True

    def _candidates(self) -> List[str]:
        names = [settings.MODEL_NAME] + [m for m in FALLBACK_MODELS if m != settings.MODEL_NAME]
        return names

    def _generate_sync(self, prompt: str) -> str:
        self._configure()
        last: Optional[Exception] = None
        for name in self._candidates():
            try:
                model = genai.GenerativeModel(name)
                resp = model.generate_content(
                    prompt, generation_config={"response_mime_type": "application/json"}
                )
                return resp.text
            except Exception as e:  # try the next model only if this one is unavailable
                last = e
                msg = str(e).lower()
                if not any(k in msg for k in ("404", "not found", "not supported", "deprecated", "no longer")):
                    raise
        raise last or RuntimeError("No Gemini model available")

    async def triage_patient(self, request: TriageRequest) -> TriageResponse:
        prompt = (
            f"{self.system_prompt}\n"
            f"Patient: {request.age} y, {request.gender}\n"
            f"Vitals: {request.vitals}\n"
            f"Input ({request.input_mode}): {request.input_text}"
        )
        loop = asyncio.get_running_loop()
        try:
            text = await asyncio.wait_for(loop.run_in_executor(None, self._generate_sync, prompt), timeout=25.0)
            return _coerce(_parse_json(text))
        except asyncio.TimeoutError:
            raise RuntimeError("Gemini call timed out")
        except Exception as e:
            raise RuntimeError(f"Gemini call failed: {e}")

    async def check(self) -> Dict[str, Any]:
        """Tiny live call used by /api/triage/status to diagnose configuration."""
        info: Dict[str, Any] = {
            "key_set": bool(settings.GEMINI_API_KEY),
            "key_looks_valid": settings.GEMINI_API_KEY.startswith("AIza"),
            "model": settings.MODEL_NAME,
        }
        try:
            loop = asyncio.get_running_loop()
            text = await asyncio.wait_for(
                loop.run_in_executor(None, self._generate_sync, 'Reply with the JSON {"ok": true}'), timeout=20.0
            )
            info.update(ok=True, reply=text[:80])
        except Exception as e:
            info.update(ok=False, error=str(e)[:300])
        return info

    async def analyze_prescription_image(self, image_base64: str, patient_context: str):
        # Multimodal dummy
        return {"extracted_medicines": ["Paracetamol"], "confidence": 0.8}
