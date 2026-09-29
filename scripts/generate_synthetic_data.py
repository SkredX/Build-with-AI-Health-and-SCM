import csv
import json
import random
import os
from datetime import datetime, timedelta

def generate_data(num_phcs_per_district=5):
    states_districts = {
        "Rajasthan": {"code": "RJ", "districts": ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota"]},
        "Maharashtra": {"code": "MH", "districts": ["Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"]},
        "Kerala": {"code": "KL", "districts": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur"]},
        "Tamil Nadu": {"code": "TN", "districts": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"]},
        "West Bengal": {"code": "WB", "districts": ["Kolkata", "Howrah", "Darjeeling", "Murshidabad", "Bardhaman"]},
        "Uttar Pradesh": {"code": "UP", "districts": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Prayagraj"]},
        "Bihar": {"code": "BR", "districts": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"]},
        "Karnataka": {"code": "KA", "districts": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"]},
        "Madhya Pradesh": {"code": "MP", "districts": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"]},
        "Assam": {"code": "AS", "districts": ["Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur"]}
    }

    coords_base = {
        "Rajasthan": (26.9, 75.7), "Maharashtra": (19.0, 73.0),
        "Kerala": (10.8, 76.2), "Tamil Nadu": (11.1, 78.6),
        "West Bengal": (22.9, 87.8), "Uttar Pradesh": (26.8, 80.9),
        "Bihar": (25.0, 85.3), "Karnataka": (15.3, 75.7),
        "Madhya Pradesh": (22.9, 78.6), "Assam": (26.2, 92.9)
    }

    drugs = [
        {"name": "ORS Sachets", "code": "DRG-001", "category": "Essential", "unit": "sachets", "max": 5000, "reorder": 500},
        {"name": "Zinc Sulfate 20mg", "code": "DRG-002", "category": "Essential", "unit": "tablets", "max": 2000, "reorder": 200},
        {"name": "Paracetamol 500mg", "code": "DRG-003", "category": "Analgesic", "unit": "tablets", "max": 10000, "reorder": 1000},
        {"name": "Amoxicillin 500mg", "code": "DRG-004", "category": "Antibiotic", "unit": "capsules", "max": 3000, "reorder": 300},
        {"name": "Polyvalent Anti-Snake Venom (ASV)", "code": "DRG-005", "category": "Antivenom", "unit": "vials", "max": 50, "reorder": 10},
        {"name": "Salbutamol Nebules", "code": "DRG-006", "category": "Respiratory", "unit": "ampoules", "max": 500, "reorder": 50},
        {"name": "Doxycycline 100mg", "code": "DRG-007", "category": "Antibiotic", "unit": "tablets", "max": 2000, "reorder": 200},
        {"name": "Iron Folic Acid tablets", "code": "DRG-008", "category": "Supplement", "unit": "tablets", "max": 5000, "reorder": 500},
        {"name": "Metformin 500mg", "code": "DRG-009", "category": "Anti-diabetic", "unit": "tablets", "max": 3000, "reorder": 300},
        {"name": "Amlodipine 5mg", "code": "DRG-010", "category": "Cardiovascular", "unit": "tablets", "max": 2000, "reorder": 200},
    ]

    diseases = [
        {"name": "Cholera", "code": "DIS-CHL", "spikes": range(25, 36)},
        {"name": "Dengue", "code": "DIS-DEN", "spikes": range(30, 46)},
        {"name": "Respiratory infections", "code": "DIS-RSP", "spikes": list(range(45, 53)) + list(range(1, 9))},
        {"name": "Snakebite", "code": "DIS-SNK", "spikes": range(20, 41)},
        {"name": "Malaria", "code": "DIS-MAL", "spikes": range(28, 43)}
    ]

    phcs = []
    inventory = []
    district_map = {"states": []}
    
    phc_id_counter = 1
    
    for state, info in states_districts.items():
        state_code = info["code"]
        state_map = {"name": state, "code": state_code, "districts": []}
        
        for district in info["districts"]:
            district_code = f"{state_code}-{district[:3].upper()}"
            dist_map = {"name": district, "code": district_code, "phc_ids": []}
            
            for _ in range(num_phcs_per_district):
                phc_id = f"PHC-{district_code}-{phc_id_counter:03d}"
                phc_id_counter += 1
                
                dist_map["phc_ids"].append(phc_id)
                
                lat = coords_base[state][0] + random.uniform(-1.5, 1.5)
                lon = coords_base[state][1] + random.uniform(-1.5, 1.5)
                
                status_roll = random.random()
                if status_roll < 0.7: status = "Operational"
                elif status_roll < 0.9: status = "Warning"
                else: status = "Critical"
                
                phcs.append({
                    "phc_id": phc_id,
                    "phc_name": f"{district} Primary Health Centre {_ + 1}",
                    "district": district,
                    "state": state,
                    "latitude": round(lat, 4),
                    "longitude": round(lon, 4),
                    "beds": random.randint(10, 50),
                    "staff_count": random.randint(5, 25),
                    "status": status
                })
                
                for d in drugs:
                    if status == "Operational":
                        stock = random.randint(d["reorder"] + 1, d["max"])
                    elif status == "Warning":
                        stock = random.randint(1, d["reorder"])
                    else:
                        stock = random.randint(0, int(d["reorder"] * 0.2))
                        
                    last_restocked = datetime.now() - timedelta(days=random.randint(5, 60))
                    expiry_date = datetime.now() + timedelta(days=random.randint(30, 365))
                    
                    inventory.append({
                        "phc_id": phc_id,
                        "drug_name": d["name"],
                        "drug_code": d["code"],
                        "category": d["category"],
                        "current_stock": stock,
                        "reorder_level": d["reorder"],
                        "max_capacity": d["max"],
                        "unit": d["unit"],
                        "last_restocked": last_restocked.strftime("%Y-%m-%d"),
                        "expiry_date": expiry_date.strftime("%Y-%m-%d")
                    })
            
            state_map["districts"].append(dist_map)
        district_map["states"].append(state_map)
        
    epidemiology = []
    for state, info in states_districts.items():
        for district in info["districts"]:
            for week in range(1, 53):
                for d in diseases:
                    is_spike = week in d["spikes"]
                    base_cases = random.randint(0, 5) if not is_spike else random.randint(20, 100)
                    cases = int(base_cases * random.uniform(0.8, 1.2))
                    deaths = int(cases * random.uniform(0, 0.05))
                    
                    if week > 1 and is_spike and week < d["spikes"][-1] - len(d["spikes"])//2:
                        trend = "rising"
                    elif week > 1 and is_spike:
                        trend = "declining"
                    else:
                        trend = random.choice(["stable", "stable", "rising", "declining"])

                    epidemiology.append({
                        "week": week,
                        "year": 2024,
                        "district": district,
                        "state": state,
                        "disease_code": d["code"],
                        "disease_name": d["name"],
                        "cases_reported": cases,
                        "deaths": deaths,
                        "trend": trend
                    })

    os.makedirs("data/seed", exist_ok=True)
    
    with open("data/seed/phc_master.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=phcs[0].keys())
        writer.writeheader()
        writer.writerows(phcs)
        
    with open("data/seed/drug_inventory.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=inventory[0].keys())
        writer.writeheader()
        writer.writerows(inventory)
        
    with open("data/seed/disease_patterns.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=epidemiology[0].keys())
        writer.writeheader()
        writer.writerows(epidemiology)
        
    with open("data/seed/district_mapping.json", "w", encoding="utf-8") as f:
        json.dump(district_map, f, indent=2)

    print(f"Successfully generated {len(phcs)} PHCs, {len(inventory)} inventory records, and {len(epidemiology)} epidemiology records.")

if __name__ == "__main__":
    generate_data(num_phcs_per_district=21)
