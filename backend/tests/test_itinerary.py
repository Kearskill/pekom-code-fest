from fastapi.testclient import TestClient
from backend.main import app
import pytest
client = TestClient(app)
SAMPLE_RESPONSE = {
    "itinerary": [
        {
            "time": "09:30-11:30",
            "place": "Islamic Arts Museum Malaysia",
            "type": "Tourist Spot",
            "reasoning": "Opens at 09:30 AM, accessible",
            "halal_status": "N/A",               # <--- required
            "accessibility": "Wheelchair-friendly",
            "transport": "Public transport"
        },
        {
            "time": "12:00-13:00",
            "place": "Restoran Kedai Kopi Sitiawan",
            "type": "Food",
            "reasoning": "Halal-certified Malaysian cuisine",
            "halal_status": "Halal",             # <--- required
            "accessibility": "Wheelchair-friendly",
            "transport": "Own vehicle"
        }
    ],
    "summary": "A short cultural day in KL",
    "transport_notes": "Own vehicle; close distances",
    "reasoning_chain": {
        "step1_parse": "parsed",
        "step2_breakfast": "step2",
        "step3_morning": "step3",
        "step4_lunch": "step4",
        "step5_afternoon": "step5",
        "step6_dinner": "step6",
        "step7_validate": "step7",
        "step8_final": "final"
    }
}





def test_generate_itinerary_success(monkeypatch):
    # Patch the JamAI client to return a deterministic response
    monkeypatch.setattr(
        "backend.services.jamai_client.jamai_client.generate_itinerary",
        lambda *a, **k: SAMPLE_RESPONSE,
    )
    monkeypatch.setattr(
    "backend.services.utils.enrich_itinerary_activity",
    lambda act: {**act,
                 "image_url": "http://example.com/image.jpg",
                 "halal_status": act.get("halal_status", "N/A")}  # ensure string
    )



    payload = {
        "start_time": "09:00",
        "dietary": "Halal only",
        "transport": "Own vehicle",
        "accessibility": "Wheelchair-friendly",
    }

    resp = client.post("/api/itinerary", json=payload)
    assert resp.status_code == 200, resp.text
    body = resp.json()

    assert "itinerary" in body
    assert body["summary"] == SAMPLE_RESPONSE["summary"]
    assert body["transport_notes"] == SAMPLE_RESPONSE["transport_notes"]
    assert len(body["itinerary"]) == len(SAMPLE_RESPONSE["itinerary"]) 

    # Check that enrichment fields are present
    for act in body["itinerary"]:
        assert "image_url" in act


def test_generate_itinerary_jamai_unavailable(monkeypatch):
    # Simulate JamAI client being unavailable / raising RuntimeError
    def raise_runtime(*a, **k):
        raise RuntimeError("JamAI client not initialized")

    monkeypatch.setattr(
        "backend.services.jamai_client.jamai_client.generate_itinerary",
        raise_runtime,
    )

    payload = {
        "start_time": "09:00",
        "dietary": "Halal only",
        "transport": "Own vehicle",
        "accessibility": "Wheelchair-friendly",
    }

    resp = client.post("/api/itinerary", json=payload)
    assert resp.status_code == 503
    assert "JamAI service unavailable" in resp.json()["detail"]
