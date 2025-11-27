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
    place_type: str = Query("All"),
    price_range: str = Query("All"),
    halal_status: str = Query("No preference"),
    accessibility: str = Query("No preference"),
    search_query: str = Query(""),
    filter_open_now: bool = Query(False)
):
    try:
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
    except Exception as e:
        print("Error in search endpoint:", e)
        raise e



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