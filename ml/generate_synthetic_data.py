import os
import random
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from pymongo import MongoClient


PUNE_AREAS = [
    "Shivaji Nagar",
    "Kothrud",
    "Deccan",
    "FC Road",
    "MG Road",
    "Hadapsar",
    "Wakad",
    "Hinjewadi",
    "Baner",
    "Aundh",
]


TEMPLATES = {
    "Sanitation": [
        "Garbage is overflowing near {area}. Smell is unbearable and dogs are tearing the trash bags.",
        "No garbage pickup for 3 days in {area}. Waste is piling up outside the society gate.",
        "Public toilet near {area} is blocked and dirty, needs cleaning urgently.",
        "Drain is clogged in {area} causing sewage smell and insects.",
    ],
    "Infrastructure": [
        "Huge pothole on the main road at {area}. Two-wheeler riders are falling frequently.",
        "Streetlight not working in {area} since last week. The road is very dark at night.",
        "Broken footpath near {area} bus stop. Pedestrians are forced to walk on the road.",
        "Waterlogging near {area} after small rain due to blocked drainage.",
    ],
    "Safety": [
        "Suspicious activity near {area} at night. Need police patrolling urgently.",
        "Accident-prone junction in {area} with no signals. Immediate action required.",
        "Open manhole in {area} is dangerous. People can get injured.",
        "Street harassment reported near {area}. Please increase surveillance.",
    ],
}


SPAM_TEXTS = [
    "hello",
    "test complaint",
    "asdf asdf",
    "please solve fast fast fast",
    "good",
]


STATUS_CHOICES = ["Pending", "In Progress", "Resolved"]


def _mongo_collection():
    load_dotenv()
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        raise RuntimeError("MONGODB_URI not set. Put it in environment or a .env file.")
    client = MongoClient(uri)
    db = client.get_default_database()
    if db is None:
        db = client["civicsense"]
    return db["complaints"]


def _random_phone():
    # Indian-style 10-digit mobile numbers starting with 6-9
    first = random.choice(["6", "7", "8", "9"])
    return first + "".join(str(random.randint(0, 9)) for _ in range(9))


def _random_datetime(days_back: int = 30):
    now = datetime.now(timezone.utc)
    delta = timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )
    return now - delta


def generate_one(i: int):
    # mix genuine + spam
    is_spam = random.random() < 0.12

    area = random.choice(PUNE_AREAS)
    category = random.choice(list(TEMPLATES.keys()))

    if is_spam:
        text = random.choice(SPAM_TEXTS)
    else:
        text = random.choice(TEMPLATES[category]).format(area=area)
        # add some variation
        if random.random() < 0.35:
            text += " " + random.choice(
                [
                    "People are complaining daily but no action is taken.",
                    "This is causing health issues for children and elders.",
                    "Please resolve this as soon as possible.",
                    "It becomes very risky during peak traffic hours.",
                ]
            )

    has_media = (not is_spam) and (random.random() < 0.45)
    image_url = f"uploads/sim_{i}.jpg" if has_media and random.random() < 0.7 else None
    audio_url = f"uploads/sim_{i}.wav" if has_media and random.random() < 0.2 else None

    created_at = _random_datetime(days_back=45)
    status = random.choices(
        STATUS_CHOICES,
        weights=[0.55, 0.25, 0.20],
        k=1,
    )[0]

    # resolved records need updatedAt > createdAt
    if status == "Resolved":
        resolve_hours = random.choice([2, 4, 8, 12, 24, 36, 48, 72, 96])
        updated_at = created_at + timedelta(hours=resolve_hours + random.randint(-1, 3))
    else:
        updated_at = created_at + timedelta(hours=random.randint(1, 24))

    # truth score distribution: spam low, genuine higher
    if is_spam:
        truth_score = round(random.uniform(0.05, 0.35), 3)
    else:
        base = random.uniform(0.55, 0.95)
        if has_media:
            base = min(1.0, base + random.uniform(0.02, 0.08))
        truth_score = round(base, 3)

    citizen_phone = _random_phone()
    citizen_name = f"Citizen {random.randint(1, 500)}"

    doc = {
        "citizen_name": citizen_name,
        "citizen_phone": citizen_phone,
        "complaint_text": text,
        "location": area,
        "category": category,
        "image_url": image_url,
        "audio_url": audio_url,
        "status": status,
        "truth_score": truth_score,
        "evidence_flags": [],
        "is_suspected_spam": bool(truth_score < 0.35),
        "recommended_department": None,
        "recommended_priority": "High" if ("urgent" in text.lower() or "accident" in text.lower()) else "Medium",
        "recommended_sla_hours": None,
        "recommendation_reason": None,
        "createdAt": created_at,
        "updatedAt": updated_at,
    }
    return doc


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--n", type=int, default=1200, help="Number of synthetic complaints to insert")
    parser.add_argument("--clear", action="store_true", help="Clear existing complaints before inserting")
    args = parser.parse_args()

    col = _mongo_collection()

    if args.clear:
        col.delete_many({})

    docs = [generate_one(i) for i in range(args.n)]
    res = col.insert_many(docs)
    print(f"Inserted {len(res.inserted_ids)} complaints into MongoDB.")


if __name__ == "__main__":
    random.seed(42)
    main()

