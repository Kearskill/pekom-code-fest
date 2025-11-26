"""
Recommendations endpoint router
"""

from fastapi import APIRouter
from datetime import datetime
from ..models.schemas import RecommendationsRequest, RecommendationsResponse, PlaceResponse
from ..services.recommendations import get_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.post("", response_model=RecommendationsResponse)
async def recommendations(request: RecommendationsRequest):
    """
    Get personalized home page recommendations.
    
    Uses logic-based filtering and scoring (NOT AI) for fast response.
    Returns places matching user preferences with reasoning.
    """
    results = get_recommendations(
        user_profile=request.user_profile.model_dump(),
        current_time=request.current_time,
        top_n=request.top_n
    )
    
    return RecommendationsResponse(
        recommendations=[PlaceResponse(**r) for r in results],
        generated_at=datetime.now().isoformat()
    )


@router.get("/quick")
async def quick_recommendations(
    dietary: str = "No preference",
    accessibility: str = "No preference",
    top_n: int = 5
):
    """
    Quick recommendations with minimal params.
    Useful for initial home page load.
    """
    results = get_recommendations(
        user_profile={
            "dietary": dietary,
            "accessibility": accessibility,
            "transport": "Public transport"
        },
        top_n=top_n
    )
    
    return {
        "recommendations": results,
        "generated_at": datetime.now().isoformat()
    }