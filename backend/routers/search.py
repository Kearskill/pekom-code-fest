"""
Search endpoint router
"""

from fastapi import APIRouter, Query
from typing import Optional
from backend.models.schemas import SearchRequest, SearchResponse, PlaceResponse
from backend.services.search_feature import search_places

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("", response_model=SearchResponse)
async def search(
    place_type: str = Query("All", description="Food / Tourist Spot / All"),
    price_range: str = Query("All", description="Budget / Medium / Premium / All"),
    halal_status: str = Query("No preference", description="Halal only / No preference"),
    accessibility: str = Query("No preference", description="Wheelchair-friendly / No preference"),
    search_query: str = Query("", description="Free text search"),
    filter_open_now: bool = Query(False, description="Only show places open now")
):
    """
    Search and filter places.
    
    This endpoint uses pure Python/Pandas for fast, deterministic filtering.
    No AI involved - instant results.
    """
    results = search_places(
        place_type=place_type,
        price_range=price_range,
        halal_status=halal_status,
        accessibility=accessibility,
        search_query=search_query,
        filter_open_now=filter_open_now
    )
    
    return SearchResponse(
        results=[PlaceResponse(**r) for r in results],
        total_count=len(results),
        filters_applied={
            "place_type": place_type,
            "price_range": price_range,
            "halal_status": halal_status,
            "accessibility": accessibility,
            "search_query": search_query,
            "filter_open_now": filter_open_now
        }
    )


@router.post("", response_model=SearchResponse)
async def search_post(request: SearchRequest):
    """
    Search with POST body (alternative to query params).
    Useful for complex filter combinations.
    """
    results = search_places(
        place_type=request.place_type,
        price_range=request.price_range,
        halal_status=request.halal_status,
        accessibility=request.accessibility,
        search_query=request.search_query,
        filter_open_now=request.filter_open_now
    )
    
    return SearchResponse(
        results=[PlaceResponse(**r) for r in results],
        total_count=len(results),
        filters_applied=request.model_dump()
    )