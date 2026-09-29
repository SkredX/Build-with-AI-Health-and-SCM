import os
import csv
import json

def seed_database():
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data", "seed")
    print(f"Loading seed data from: {data_dir}...")
    
    with open(os.path.join(data_dir, "phc_master.csv"), "r", encoding="utf-8") as f:
        phcs = list(csv.DictReader(f))
        print(f"Loaded {len(phcs)} PHC records.")

    with open(os.path.join(data_dir, "drug_inventory.csv"), "r", encoding="utf-8") as f:
        inventory = list(csv.DictReader(f))
        print(f"Loaded {len(inventory)} inventory records.")
        
    with open(os.path.join(data_dir, "disease_patterns.csv"), "r", encoding="utf-8") as f:
        diseases = list(csv.DictReader(f))
        print(f"Loaded {len(diseases)} epidemiological records.")
        
    with open(os.path.join(data_dir, "district_mapping.json"), "r", encoding="utf-8") as f:
        mapping = json.load(f)
        states = len(mapping.get("states", []))
        districts = sum(len(s.get("districts", [])) for s in mapping.get("states", []))
        print(f"Loaded mapping for {states} states and {districts} districts.")
        
    print("Database successfully seeded! (Mock output)")

if __name__ == "__main__":
    seed_database()
