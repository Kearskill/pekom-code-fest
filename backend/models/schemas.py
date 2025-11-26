"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from enum import Enum


# ========== ENUMS ==========

class PlaceType(str, Enum):
    FOOD = "Food"
    TOURIST_SPOT = "Tourist Spot"
    ALL = "All"


class PriceRange(str, Enum):
    BUDGET = "Budget"
    MEDIUM = "Medium"
    PREMIUM = "Premium"
    ALL = "All"


class DietaryPreference(str, Enum):
    HALAL_ONLY = "Halal only"
    NO_PREFERENCE = "No preference"


class TransportMode(str, Enum):
    PUBLIC = "Public transport"
    TAXI = "Taxi/Grab"
    OWN_VEHICLE = "Own vehicle"


class AccessibilityPreference(str, Enum):
    WHEELCHAIR = "Wheelchair-friendly"
    NO_PREFERENCE = "No preference"


# ========== REQUEST MODELS ==========

class SearchRequest(BaseModel):
    """Request model for search endpoint"""
    place_type: PlaceType = PlaceType.ALL
    price_range: PriceRange = PriceRange.ALL
    halal_status: DietaryPreference = DietaryPreference.NO_PREFERENCE
    accessibility: AccessibilityPreference = AccessibilityPreference.NO_PREFERENCE
    search_query: str = ""
    filter_open_now: bool = False

    class Config:
        use_enum_values = True


class ItineraryRequest(BaseModel):
    """Request model for itinerary generation"""
    start_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", examples=["09:00"])
    dietary: DietaryPreference = DietaryPreference.NO_PREFERENCE
    transport: TransportMode = TransportMode.PUBLIC
    accessibility: AccessibilityPreference = AccessibilityPreference.NO_PREFERENCE

    class Config:
        use_enum_values = True


class UserProfile(BaseModel):
    """User profile for recommendations"""
    dietary: DietaryPreference = DietaryPreference.NO_PREFERENCE
    transport: TransportMode = TransportMode.PUBLIC
    accessibility: AccessibilityPreference = AccessibilityPreference.NO_PREFERENCE

    class Config:
        use_enum_values = True


class RecommendationsRequest(BaseModel):
    """Request model for recommendations"""
    user_profile: UserProfile
    current_time: Optional[str] = Field(None, pattern=r"^\d{2}:\d{2}$")
    top_n: int = Field(5, ge=1, le=20)


# ========== RESPONSE MODELS ==========

class PlaceResponse(BaseModel):
    """Response model for a single place"""
    name: str
    type: str
    image_url: Optional[str] = None  # GitHub raw URL
    category: Optional[str] = None
    cuisine: Optional[str] = None
    price_range: Optional[str] = None
    halal_status: Optional[str] = None
    address: Optional[str] = None
    opening_hours: Optional[str] = None
    is_open_now: bool = False
    description: Optional[str] = None
    accessibility_info: Optional[str] = None
    is_wheelchair_accessible: bool = False
    how_to_get_there: Optional[str] = None
    contact: Optional[str] = None
    famous_for: Optional[str] = None
    ticket_price: Optional[str] = None
    reasoning: Optional[str] = None  # For recommendations


class ItineraryActivity(BaseModel):
    """Single activity in itinerary - enriched with full place data"""
    time: str
    place: str
    type: str
    reasoning: str
    # Enriched fields (looked up from CSV after RAG)
    image_url: Optional[str] = None
    address: Optional[str] = None
    opening_hours: Optional[str] = None
    price_range: Optional[str] = None
    halal_status: Optional[str] = None
    description: Optional[str] = None
    accessibility_info: Optional[str] = None
    how_to_get_there: Optional[str] = None


class ReasoningChain(BaseModel):
    """Multi-step reasoning chain for judges"""
    step1_parse: str
    step2_morning: str
    step3_lunch: str
    step4_afternoon: str
    step5_validate: str
    step6_final: str


class ItineraryResponse(BaseModel):
    """Response model for generated itinerary"""
    itinerary: List[ItineraryActivity]
    summary: str
    transport_notes: str
    reasoning_chain: ReasoningChain


class SearchResponse(BaseModel):
    """Response model for search results"""
    results: List[PlaceResponse]
    total_count: int
    filters_applied: dict


class RecommendationsResponse(BaseModel):
    """Response model for recommendations"""
    recommendations: List[PlaceResponse]
    generated_at: str