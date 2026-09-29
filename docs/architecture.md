# Architecture Document

## Overview
PHC-Connect Enterprise is designed as a scalable microservices-based system to handle real-time inventory management and epidemiological surveillance.

## Component Diagram
```mermaid
graph TD
    User --> WebApp
    WebApp --> API_Gateway
    API_Gateway --> Auth_Service
    API_Gateway --> Inventory_Service
    API_Gateway --> Analytics_Service
    Inventory_Service --> DB[(PostgreSQL)]
    Analytics_Service --> ML_Model[Federated Model]
```

## Data Flow
Data is entered at the PHC level via the Next.js client, processed by the FastAPI backend, and stored in a central relational database. ML analytics run in the background.

## Deployment Architecture
Deployed on scalable cloud infrastructure with containerized (Docker) microservices orchestrated by Kubernetes.
