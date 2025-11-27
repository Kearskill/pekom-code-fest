"""
Itinerary generation endpoint router
Uses JamAI Base Action Table for RAG + multi-step reasoning
ENRICHES results with full place data (including images) from local CSV
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import json
from typing import AsyncGenerator

from models.schemas import (
    ItineraryRequest, 
    ItineraryResponse, 
    ItineraryActivity, 
    ReasoningChain
)
from services.jamai_client import jamai_client
from services.utils import enrich_itinerary_activity  # Import enrichment

router = APIRouter(prefix="/api/itinerary", tags=["Trip Planner"])


@router.post("", response_model=ItineraryResponse)
async def generate_itinerary(request: ItineraryRequest):
    """
    Generate AI-powered day trip itinerary.
    
    This is the MAIN SHOWCASE feature using JamAI Base with:
    - RAG (Retrieval-Augmented Generation) from PlacesKB
    - 6-step multi-step reasoning chain
    
    **ENRICHMENT:** After JamAI returns place names, we look up full data
    (including image_url, address, etc.) from the local CSV.
    
    **JamAI Action Table:** TripPlanner
    **Knowledge Table:** PlacesKB (33 Malaysian places)
    """
    try:
        # Step 1: Call JamAI Action Table (returns place names + reasoning)
        result = jamai_client.generate_itinerary(
            start_time=request.start_time,
            dietary=request.dietary,
            transport=request.transport,
            accessibility=request.accessibility,
            stream=False
        )
        
        # Step 2: ENRICH each activity with full data from CSV (including images!)
        itinerary_activities = []
        for activity in result.get("itinerary", []):
            enriched = enrich_itinerary_activity(activity)
            itinerary_activities.append(ItineraryActivity(
                time=enriched.get("time", ""),
                place=enriched.get("place", ""),
                type=enriched.get("type", ""),
                reasoning=enriched.get("reasoning", ""),
                # Enriched fields from CSV lookup
                image_url=enriched.get("image_url"),
                address=enriched.get("address"),
                opening_hours=enriched.get("opening_hours"),
                price_range=enriched.get("price_range"),
                halal_status=enriched.get("halal_status"),
                description=enriched.get("description"),
                accessibility_info=enriched.get("accessibility_info"),
                how_to_get_there=enriched.get("how_to_get_there"),
            ))
        
        # Format reasoning chain (for judges to see)
        reasoning = ReasoningChain(
            step1_parse=result["reasoning_chain"].get("step1_parse", ""),
            step2_morning=result["reasoning_chain"].get("step2_morning", ""),
            step3_lunch=result["reasoning_chain"].get("step3_lunch", ""),
            step4_afternoon=result["reasoning_chain"].get("step4_afternoon", ""),
            step5_validate=result["reasoning_chain"].get("step5_validate", ""),
            step6_final=result["reasoning_chain"].get("step6_final", "")
        )
        
        return ItineraryResponse(
            itinerary=itinerary_activities,
            summary=result.get("summary", ""),
            transport_notes=result.get("transport_notes", ""),
            reasoning_chain=reasoning
        )
        
    except RuntimeError as e:
        # JamAI client not configured
        raise HTTPException(
            status_code=503,
            detail=f"JamAI service unavailable: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate itinerary: {str(e)}"
        )


@router.post("/stream")
async def generate_itinerary_stream(request: ItineraryRequest):
    """
    Generate itinerary with streaming response.
    
    Returns Server-Sent Events (SSE) for live UI updates.
    Each chunk contains: {"step": "step2_morning", "text": "token..."}
    """
    async def event_generator() -> AsyncGenerator[str, None]:
        accumulated = {}
        
        def on_chunk(col_name: str, text: str):
            accumulated[col_name] = accumulated.get(col_name, "") + text
        
        try:
            result = jamai_client.generate_itinerary_streaming(
                start_time=request.start_time,
                dietary=request.dietary,
                transport=request.transport,
                accessibility=request.accessibility,
                on_chunk=on_chunk
            )
            
            # Enrich before sending
            enriched_itinerary = [
                enrich_itinerary_activity(act) 
                for act in result.get("itinerary", [])
            ]
            result["itinerary"] = enriched_itinerary
            
            # Send final result
            yield f"data: {json.dumps({'type': 'complete', 'data': result})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


@router.get("/health")
async def health_check():
    """Check if JamAI connection is working"""
    return {
        "status": "ok" if jamai_client.client else "unavailable",
        "jamai_connected": jamai_client.client is not None,
        "action_table": jamai_client.action_table_id if jamai_client.client else None
    }