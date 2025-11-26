"""
Home page recommendations - Logic-based filtering
"""

from typing import List, Dict, Optional
from datetime import datetime
from .utils import (
    load_data, is_open_now, is_wheelchair_accessible,
    matches_halal_requirement, format_place_response
)


def get_recommendations(
    user_profile: Dict,
    current_time: Optional[str] = None,
    top_n: int = 5
) -> List[Dict]:
    """
    Get personalized recommendations based on user profile.
    
    Uses simple logic-based filtering + scoring (NOT AI).
    """
    df = load_data()
    
    # Get current time if not provided
    if current_time is None:
        current_time = datetime.now().strftime("%H:%M")
    
    # Filter based on user preferences
    dietary = user_profile.get("dietary", "No preference")
    accessibility = user_profile.get("accessibility", "No preference")
    
    # Apply halal filter
    if dietary == "Halal only":
        df = df[df["Halal_Status"].isin(["Halal", "Muslim-Friendly"])]
    
    # Apply accessibility filter
    if accessibility == "Wheelchair-friendly":
        df = df[df["Accessibility_Info"].apply(
            lambda x: is_wheelchair_accessible(x) if x else False
        )]
    
    # Score remaining places
    scores = []
    for _, row in df.iterrows():
        score = 0
        reasons = []
        
        # Bonus for being open now
        if is_open_now(row.get("Opening_Hours", ""), current_time):
            score += 3
            reasons.append("open now")
        
        # Time-based relevance
        hour = int(current_time.split(":")[0])
        if row["Type"] == "Food":
            if 11 <= hour <= 14:
                score += 2
                reasons.append("good for lunch")
            elif 18 <= hour <= 21:
                score += 2
                reasons.append("good for dinner")
        else:
            if 9 <= hour <= 17:
                score += 1
                reasons.append("good time to visit")
        
        # Halal bonus when user requires it
        if dietary == "Halal only" and row.get("Halal_Status") == "Halal":
            score += 1
            reasons.append("halal certified")
        
        # Accessibility bonus
        if accessibility == "Wheelchair-friendly":
            if is_wheelchair_accessible(row.get("Accessibility_Info", "")):
                score += 1
                reasons.append("wheelchair accessible")
        
        # Build place response with reasoning
        place = format_place_response(row)
        place["score"] = score
        place["reasoning"] = ", ".join(reasons).capitalize() if reasons else "Popular choice"
        scores.append(place)
    
    # Sort by score and return top N
    scores.sort(key=lambda x: x["score"], reverse=True)
    
    # Remove score from response (internal only)
    for place in scores:
        del place["score"]
    
    return scores[:top_n]