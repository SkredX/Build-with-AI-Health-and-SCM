import pytest
from services.redistribution_engine import RedistributionEngine
from models.database import db

def test_optimize_transfers():
    engine = RedistributionEngine()
    
    # Setup state in DB
    db.inventory["P1"] = {"ORS": {"quantity": 100}} # Surplus (100 - 50 = 50)
    db.inventory["P2"] = {"ORS": {"quantity": 10}}  # Deficit (50 - 10 = 40)
    
    transfers = engine.optimize_transfers("D1", "ORS")
    
    assert len(transfers) > 0
    t = transfers[0]
    assert t.source_phc == "P1"
    assert t.dest_phc == "P2"
    assert t.quantity == 40
    assert t.priority == "High"

def test_haversine():
    engine = RedistributionEngine()
    dist = engine._haversine(26.9124, 75.7873, 26.85, 75.8)
    assert dist > 0
    assert dist < 100 # They are close by
