from fastapi import APIRouter
from models.database import db

router = APIRouter()

@router.get("/inventory")
def list_inventory():
    return db.get_inventory()

@router.get("/inventory/{phc_id}")
def get_phc_inventory(phc_id: str):
    return db.get_inventory(phc_id)

@router.put("/inventory/{phc_id}/{drug_code}")
def update_stock(phc_id: str, drug_code: str, quantity: int):
    db.update_stock(phc_id, drug_code, quantity)
    return {"status": "success", "phc_id": phc_id, "drug_code": drug_code, "new_quantity": quantity}

@router.get("/inventory/summary")
def get_summary():
    # Dummy aggregate
    return {"total_phcs": len(db.get_phcs()), "total_stock": sum([item["quantity"] for inv in db.get_inventory().values() for item in inv.values()])}
