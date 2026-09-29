# Seed Data

This directory contains synthetic seed data for the PHC-Connect Enterprise platform. The data represents 1,029 Primary Health Centres (PHCs) across 50 districts in 10 Indian states.

## Datasets

- `phc_master.csv`: Base details of each PHC, including location, bed capacity, staff, and operational status.
- `drug_inventory.csv`: Essential drug stocks for all PHCs, including current stock, max capacity, and reorder levels.
- `disease_patterns.csv`: 52-week epidemiological surveillance data (simulating IDSP data) showing case trends.
- `district_mapping.json`: Hierarchical JSON representing State -> District -> PHC mapping.

## Generation

Run `python ../scripts/generate_synthetic_data.py` to regenerate the data. The data is randomized to simulate realistic geographic and inventory conditions.
