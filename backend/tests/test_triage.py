import pytest
from fastapi.testclient import TestClient
from main import app
from models.schemas import TriageRequest

client = TestClient(app)

def test_triage_heuristic_hindi():
    req = TriageRequest(
        patient_id="123",
        patient_name="Test Patient",
        age=30,
        gender="Male",
        phc_name="PHC 1",
        vitals={"temp": 98.6},
        input_text="मुझे सांप ने काटा है",
        input_mode="text"
    )
    
    response = client.post("/api/triage", json=req.dict())
    assert response.status_code == 200
    data = response.json()
    assert data["condition"] == "Snakebite"
    assert data["urgency"] == "Critical"
    assert "Anti-Snake Venom" in data["medicines"]

def test_triage_heuristic_english():
    req = TriageRequest(
        patient_id="124",
        patient_name="Test Patient 2",
        age=25,
        gender="Female",
        phc_name="PHC 2",
        vitals={"temp": 102.0},
        input_text="severe diarrhea and dehydration",
        input_mode="text"
    )
    
    response = client.post("/api/triage", json=req.dict())
    assert response.status_code == 200
    data = response.json()
    assert data["condition"] == "Cholera/Diarrhea"
    assert data["urgency"] == "High"
    assert "ORS" in data["medicines"]

def test_triage_heuristic_hinglish_snakebite():
    req = TriageRequest(
        patient_id="125",
        patient_name="Test Patient 3",
        age=34,
        gender="Female",
        phc_name="Chomu PHC",
        vitals={"temp": 98.4},
        input_text="Patient ko ek kaale rang ke saanp ne kaata hai",
        input_mode="audio"
    )
    
    response = client.post("/api/triage", json=req.dict())
    assert response.status_code == 200
    data = response.json()
    assert data["condition"] == "Snakebite"
    assert data["urgency"] == "Critical"
    assert "Anti-Snake Venom" in data["medicines"]

