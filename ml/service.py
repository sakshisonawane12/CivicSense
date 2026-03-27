import os
from typing import Optional, Literal

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field


ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "artifacts")


def _load_optional(name: str):
    path = os.path.join(ARTIFACT_DIR, name)
    if not os.path.exists(path):
        return None
    try:
        return joblib.load(path)
    except Exception:
        # Don't crash the service if an artifact was trained
        # with a different scikit-learn version.
        return None


category_model = _load_optional("category_model.joblib")
truth_model = _load_optional("truth_model.joblib")
sla_model = _load_optional("sla_model.joblib")


app = FastAPI(title="CivicSense ML Service", version="1.0.0")


class CategoryReq(BaseModel):
    text: str = Field(..., min_length=1)


class CategoryRes(BaseModel):
    category: Literal["Sanitation", "Infrastructure", "Safety"]
    confidence: float


class TruthReq(BaseModel):
    text_len: int = Field(..., ge=0, le=5000)
    has_media: int = Field(..., ge=0, le=1)
    hour: int = Field(12, ge=0, le=23)
    dow: int = Field(0, ge=0, le=6)
    phone_2d_count: int = Field(0, ge=0, le=1000)
    loccat_count: int = Field(0, ge=0, le=100000)


class TruthRes(BaseModel):
    truth_score: float


class SlaReq(BaseModel):
    cat_id: int = Field(..., ge=0, le=1000)
    loc_id: int = Field(..., ge=0, le=200000)
    hour: int = Field(12, ge=0, le=23)
    dow: int = Field(0, ge=0, le=6)
    text_len: int = Field(..., ge=0, le=5000)
    has_media: int = Field(..., ge=0, le=1)


class SlaRes(BaseModel):
    sla_hours: float


@app.get("/health")
def health():
    return {
        "ok": True,
        "models": {
            "category": bool(category_model),
            "truth": bool(truth_model),
            "sla": bool(sla_model),
        },
    }


@app.post("/predict/category", response_model=CategoryRes)
def predict_category(req: CategoryReq):
    if category_model is None:
        return {"category": "Infrastructure", "confidence": 0.0}

    proba = getattr(category_model, "predict_proba", None)
    pred = category_model.predict([req.text])[0]
    conf = 0.6
    if proba:
        probs = category_model.predict_proba([req.text])[0]
        conf = float(np.max(probs))

    # Ensure valid label
    if pred not in ("Sanitation", "Infrastructure", "Safety"):
        pred = "Infrastructure"
        conf = 0.3

    return {"category": pred, "confidence": conf}


@app.post("/predict/truth", response_model=TruthRes)
def predict_truth(req: TruthReq):
    if truth_model is None:
        return {"truth_score": 0.5}

    X = np.array([[req.text_len, req.has_media, req.hour, req.dow, req.phone_2d_count, req.loccat_count]])
    p = truth_model.predict_proba(X)[0, 1]
    return {"truth_score": float(p)}


@app.post("/predict/sla", response_model=SlaRes)
def predict_sla(req: SlaReq):
    if sla_model is None:
        return {"sla_hours": 24.0}

    X = np.array([[req.cat_id, req.loc_id, req.hour, req.dow, req.text_len, req.has_media]])
    pred = float(sla_model.predict(X)[0])
    pred = float(np.clip(pred, 1.0, 24 * 30))
    return {"sla_hours": pred}

