import os
import json
from datetime import datetime, timezone

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, mean_absolute_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import HistGradientBoostingRegressor
import joblib


ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "artifacts")


def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def _mongo_collection():
    load_dotenv()
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        raise RuntimeError("MONGODB_URI not set. Put it in environment or a .env file.")

    client = MongoClient(uri)
    # Use default DB from URI; fallback to 'civicsense'
    db = client.get_default_database()
    if db is None:
        db = client["civicsense"]
    return db["complaints"]


def load_complaints_df(limit: int | None = None) -> pd.DataFrame:
    col = _mongo_collection()
    cursor = col.find(
        {},
        {
            "complaint_text": 1,
            "category": 1,
            "location": 1,
            "citizen_phone": 1,
            "createdAt": 1,
            "updatedAt": 1,
            "status": 1,
            "image_url": 1,
            "audio_url": 1,
            "truth_score": 1,
            "is_suspected_spam": 1,
        },
    ).sort("createdAt", -1)
    if limit:
        cursor = cursor.limit(limit)
    rows = list(cursor)
    if not rows:
        raise RuntimeError("No complaints found in MongoDB.")

    df = pd.DataFrame(rows)
    # normalize
    df["complaint_text"] = df["complaint_text"].fillna("").astype(str)
    df["category"] = df["category"].fillna("Infrastructure").astype(str)
    df["location"] = df["location"].fillna("").astype(str)
    df["citizen_phone"] = df["citizen_phone"].fillna("").astype(str)
    df["has_media"] = df[["image_url", "audio_url"]].notna().any(axis=1).astype(int)
    df["createdAt"] = pd.to_datetime(df["createdAt"], utc=True, errors="coerce")
    df["updatedAt"] = pd.to_datetime(df["updatedAt"], utc=True, errors="coerce")
    df["hour"] = df["createdAt"].dt.hour.fillna(12).astype(int)
    df["dow"] = df["createdAt"].dt.dayofweek.fillna(0).astype(int)
    df["text_len"] = df["complaint_text"].str.len().clip(0, 2000).astype(int)
    return df


def train_category_model(df: pd.DataFrame):
    X = df["complaint_text"].values
    y = df["category"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y)) > 1 else None
    )

    # Optimized: TF-IDF + linear classifier (fast inference, small memory)
    pipe = Pipeline(
        steps=[
            ("tfidf", TfidfVectorizer(
                max_features=25000,
                ngram_range=(1, 2),
                min_df=2,
                strip_accents="unicode",
                lowercase=True,
            )),
            ("clf", LogisticRegression(
                max_iter=2000,
                n_jobs=-1,
                class_weight="balanced",
                solver="saga",
            )),
        ]
    )
    pipe.fit(X_train, y_train)
    pred = pipe.predict(X_test)

    report = classification_report(y_test, pred, output_dict=True, zero_division=0)
    return pipe, report


def _weak_truth_label(df: pd.DataFrame) -> np.ndarray:
    # If your app already stored is_suspected_spam, use it.
    if "is_suspected_spam" in df.columns and df["is_suspected_spam"].notna().any():
        # label 1 = genuine, 0 = spam
        return (~df["is_suspected_spam"].fillna(False)).astype(int).values

    # Otherwise generate weak labels from truth_score if present, else from simple heuristic.
    if "truth_score" in df.columns and df["truth_score"].notna().any():
        return (df["truth_score"].fillna(0.5) >= 0.5).astype(int).values

    # fallback heuristic
    return ((df["text_len"] >= 40) | (df["has_media"] == 1)).astype(int).values


def _truth_features(df: pd.DataFrame) -> pd.DataFrame:
    # Reporter frequency in last 2 days (approx, dataset-level)
    # For training we compute per phone counts over last 2 days relative to dataset max time.
    max_time = df["createdAt"].max()
    if pd.isna(max_time):
        max_time = datetime.now(timezone.utc)

    window_start = max_time - pd.Timedelta(days=2)
    recent = df[df["createdAt"] >= window_start]
    phone_counts = recent.groupby("citizen_phone").size().rename("phone_2d_count")
    df = df.copy()
    df["phone_2d_count"] = df["citizen_phone"].map(phone_counts).fillna(0).astype(int)

    # Location-category activity (cluster support proxy)
    lc_counts = df.groupby(["location", "category"]).size().rename("loccat_count")
    df["loccat_count"] = list(zip(df["location"], df["category"]))
    df["loccat_count"] = df["loccat_count"].map(lc_counts).fillna(0).astype(int)

    feats = df[["text_len", "has_media", "hour", "dow", "phone_2d_count", "loccat_count"]].copy()
    return feats


def train_truth_model(df: pd.DataFrame):
    X = _truth_features(df)
    y = _weak_truth_label(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y)) > 1 else None
    )

    clf = LogisticRegression(
        max_iter=2000,
        n_jobs=-1,
        class_weight="balanced",
        solver="lbfgs",
    )
    clf.fit(X_train, y_train)
    pred = clf.predict(X_test)
    proba = clf.predict_proba(X_test)[:, 1]

    report = classification_report(y_test, pred, output_dict=True, zero_division=0)
    report["roc_proxy_mean_proba"] = float(np.mean(proba))
    return clf, report


def _sla_dataset(df: pd.DataFrame) -> pd.DataFrame:
    resolved = df[df["status"] == "Resolved"].copy()
    resolved = resolved[resolved["createdAt"].notna() & resolved["updatedAt"].notna()]
    if resolved.empty:
        return resolved
    resolved["resolution_hours"] = (resolved["updatedAt"] - resolved["createdAt"]).dt.total_seconds() / 3600.0
    resolved["resolution_hours"] = resolved["resolution_hours"].clip(lower=0.1, upper=24 * 30)
    return resolved


def train_sla_model(df: pd.DataFrame):
    resolved = _sla_dataset(df)
    if len(resolved) < 30:
        return None, {"warning": "Not enough resolved complaints to train SLA model (need ~30+)."}

    # Lightweight features; location as hashed numeric via pandas factorize
    resolved = resolved.copy()
    resolved["cat_id"] = pd.factorize(resolved["category"])[0]
    resolved["loc_id"] = pd.factorize(resolved["location"])[0]

    X = resolved[["cat_id", "loc_id", "hour", "dow", "text_len", "has_media"]].values
    y = resolved["resolution_hours"].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Optimized: histogram gradient boosting (fast, strong on tabular)
    reg = HistGradientBoostingRegressor(
        max_depth=6,
        learning_rate=0.08,
        max_iter=300,
        random_state=42,
    )
    reg.fit(X_train, y_train)
    pred = reg.predict(X_test)

    metrics = {
        "mae_hours": float(mean_absolute_error(y_test, pred)),
        "r2": float(r2_score(y_test, pred)),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "category_mapping": dict(enumerate(pd.factorize(resolved["category"])[1].tolist())),
        "location_mapping_size": int(resolved["loc_id"].nunique()),
    }
    return (reg, metrics)


def main():
    _ensure_dir(ARTIFACT_DIR)
    df = load_complaints_df()

    category_model, category_report = train_category_model(df)
    truth_model, truth_report = train_truth_model(df)
    sla_model, sla_metrics = train_sla_model(df)

    joblib.dump(category_model, os.path.join(ARTIFACT_DIR, "category_model.joblib"))
    joblib.dump(truth_model, os.path.join(ARTIFACT_DIR, "truth_model.joblib"))

    if sla_model is not None:
        joblib.dump(sla_model, os.path.join(ARTIFACT_DIR, "sla_model.joblib"))

    meta = {
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "n_complaints": int(len(df)),
        "reports": {
            "category": category_report,
            "truth": truth_report,
            "sla": sla_metrics,
        },
    }
    with open(os.path.join(ARTIFACT_DIR, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    print("Saved artifacts to:", ARTIFACT_DIR)
    print(json.dumps(meta["reports"], indent=2))


if __name__ == "__main__":
    main()

