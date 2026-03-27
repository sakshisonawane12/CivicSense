# CivicSense ML (3 optimized models)

This folder adds **three trainable ML models** that learn from your live MongoDB complaint data.

## The 3 models

1) **Category Classifier (Text → Category)**
- **Model**: TF‑IDF (1–2 grams) + Logistic Regression (linear, sparse, fast)
- **Predicts**: `Sanitation | Infrastructure | Safety`

2) **TruthScore Model (Tabular → Authenticity probability)**
- **Model**: Logistic Regression
- **Predicts**: `truth_score` in \([0,1]\)
- **Training labels**: uses `is_suspected_spam` / `truth_score` fields if present (weak supervision), otherwise a simple fallback heuristic.

3) **SLA / Resolution ETA Model (Tabular → hours)**
- **Model**: Histogram Gradient Boosting Regressor (fast, strong on tabular)
- **Predicts**: expected resolution time in hours (used to recommend SLA)

## Train

From a terminal:

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python generate_synthetic_data.py --n 1200 --clear
python train_models.py
```

Artifacts are saved to `ml/artifacts/`.

## Run inference service

```bash
cd ml
.venv\Scripts\activate
uvicorn service:app --host 0.0.0.0 --port 8001
```

Then set this for backend:

```bash
set ML_SERVICE_URL=http://localhost:8001
```

The backend will automatically call:
- `POST /predict/category`
- `POST /predict/truth`
- `POST /predict/sla`

If the ML service is not running, the backend falls back to existing Gemini/rules.

