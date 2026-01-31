from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import stores, metrics

app = FastAPI(
    title="Branch Dashboard API",
    description="API for nationwide branch dashboard with time-series metrics",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stores.router)
app.include_router(metrics.router)


@app.get("/")
def root():
    return {"message": "Branch Dashboard API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
