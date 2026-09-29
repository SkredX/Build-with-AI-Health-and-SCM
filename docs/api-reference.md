# API Reference

## Authentication
All API endpoints require a Bearer token in the `Authorization` header.

## Endpoints

### `GET /api/v1/inventory/{phc_id}`
Returns current inventory for a specific PHC.

**Response (200 OK):**
```json
{
  "phc_id": "PHC-RJ-JAI-001",
  "inventory": [
    {"drug_name": "Paracetamol", "current_stock": 500, "status": "Operational"}
  ]
}
```

### `POST /api/v1/inventory/update`
Updates drug stock for a PHC.

### `GET /api/v1/epidemiology/alerts`
Returns AI-generated outbreak alerts based on disease patterns.

## Error Codes
- `400 Bad Request`: Invalid parameters.
- `401 Unauthorized`: Missing or invalid token.
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Backend failure.
