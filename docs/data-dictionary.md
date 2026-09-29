# Data Dictionary

## Data Standards
Data schemas align with Indian healthcare data standards (IDSP, HMIS, ABDM).

## `phc_master.csv`
- `phc_id`: Unique identifier for the PHC.
- `phc_name`: Name of the PHC.
- `district`, `state`: Geographic location.
- `latitude`, `longitude`: GPS coordinates.
- `beds`: Total bed capacity.
- `staff_count`: Number of medical staff.
- `status`: Operational status (Operational, Warning, Critical).

## `drug_inventory.csv`
- `drug_name`, `drug_code`: Name and code of the medicine.
- `category`: Drug classification (Essential, Antibiotic, etc.).
- `current_stock`: Current quantity available.
- `reorder_level`: Threshold below which a reorder is triggered.
- `max_capacity`: Maximum storage capacity.
- `unit`: Unit of measurement (tablets, vials).
- `last_restocked`, `expiry_date`: Dates for inventory tracking.

## `disease_patterns.csv`
- `week`, `year`: Timeframe of the report.
- `district`, `state`: Geographic location.
- `disease_code`, `disease_name`: The specific disease tracked.
- `cases_reported`, `deaths`: Morbidity and mortality figures.
- `trend`: Epidemiological trend (rising, stable, declining).
