from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

from routers import triage, forecast, redistribution, alerts, inventory, fhir, geojson

app = FastAPI(title="PHC-Connect Enterprise Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(triage.router, prefix="/api")
app.include_router(forecast.router, prefix="/api")
app.include_router(redistribution.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")
app.include_router(fhir.router, prefix="/api")
app.include_router(geojson.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
