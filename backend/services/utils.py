"""
Utility functions for data processing
No JamAI dependencies - pure Python logic
"""

import pandas as pd
from datetime import datetime, time
import re
from typing import Optional, List, Dict
import os

# Get the data directory path
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def load_data() -> pd.DataFrame:
    """
    Load the tourism data.
    Supports both CSV and Parquet formats.
    """
    csv_path = os.path.join(DATA_DIR, "combine_new.csv")
    parquet_path = os.path.join(DATA_DIR, "combined.parquet")
    
    # Try CSV first (your actual data file)
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path)
    elif os.path.exists(parquet_path):
        return pd.read_parquet(parquet_path)
    else:
        raise FileNotFoundError(
            f"No data file found. Place combine_new.csv or combined.parquet in {DATA_DIR}"
        )


def parse_time(time_str: str) -> Optional[time]:
    """Convert time string to datetime.time object"""
    try:
        return datetime.strptime(time_str.strip(), "%H:%M").time()
    except:
        try:
            return datetime.strptime(time_str.strip(), "%I:%M %p").time()
        except:
            return None


def is_open_now(opening_hours_str: str, check_time: Optional[str] = None) -> bool:
    """Check if a place is open at given time"""
    if pd.isna(opening_hours_str):
        return False
    
    opening_hours_str = str(opening_hours_str).strip()
    
    if "24/7" in opening_hours_str or "24 hours" in opening_hours_str.lower():
        return True
    
    if check_time is None:
        check_time_obj = datetime.now().time()
    else:
        check_time_obj = parse_time(check_time)
        if check_time_obj is None:
            return False
    
    pattern = r'(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})'
    match = re.search(pattern, opening_hours_str)
    
    if match:
        open_time = parse_time(match.group(1))
        close_time = parse_time(match.group(2))
        
        if open_time and close_time:
            if close_time < open_time:
                return check_time_obj >= open_time or check_time_obj <= close_time
            else:
                return open_time <= check_time_obj <= close_time
    
    return False


def is_wheelchair_accessible(accessibility_info: str) -> bool:
    """Check if place is wheelchair accessible"""
    if pd.isna(accessibility_info):
        return False
    
    accessibility_info = str(accessibility_info).lower()
    
    negative_keywords = [
        'not wheelchair accessible', 'no wheelchair access',
        'limited access', 'stairs only', 'no ramps', 'no elevator'
    ]
    
    for keyword in negative_keywords:
        if keyword in accessibility_info:
            return False
    
    positive_keywords = [
        'wheelchair accessible', 'wheelchair-friendly', 'wheelchair friendly',
        'ramps available', 'elevator available', 'lift access', 'accessible entrance'
    ]
    
    for keyword in positive_keywords:
        if keyword in accessibility_info:
            return True
    
    return False


def matches_halal_requirement(place_halal_status: str, user_requirement: str) -> bool:
    """Check if place matches user's halal requirement"""
    if user_requirement == "No preference":
        return True
    
    if pd.isna(place_halal_status):
        return False
    
    place_halal_status = str(place_halal_status).strip()
    return place_halal_status in ["Halal", "Muslim-Friendly"]


def extract_price_min(price_str: str) -> int:
    """Extract minimum price from price range string"""
    if pd.isna(price_str):
        return 999999
    
    price_str = str(price_str).upper().strip()
    
    if "FREE" in price_str:
        return 0
    
    numbers = re.findall(r'\d+', price_str)
    if numbers:
        return int(numbers[0])
    
    return 999999


def format_place_response(row: pd.Series) -> Dict:
    """Format a DataFrame row into API response format"""
    return {
        "name": row.get("Name", ""),
        "type": row.get("Type", ""),
        "image_url": row.get("Image_URL"),  # GitHub raw URL
        "category": row.get("Category"),
        "cuisine": row.get("Cuisine"),
        "price_range": row.get("Price_Range"),
        "halal_status": row.get("Halal_Status"),
        "address": row.get("Address"),
        "opening_hours": row.get("Opening_Hours"),
        "is_open_now": is_open_now(row.get("Opening_Hours", "")),
        "description": row.get("Description"),
        "accessibility_info": row.get("Accessibility_Info"),
        "is_wheelchair_accessible": is_wheelchair_accessible(row.get("Accessibility_Info", "")),
        "how_to_get_there": row.get("Public_Transport"),
        "contact": row.get("Contact_Website"),
        "famous_for": row.get("Famous_Dish"),
        "ticket_price": row.get("Ticket_Price_Breakdown"),
    }


def lookup_place_by_name(place_name: str) -> Optional[Dict]:
    """
    Look up a place by name and return full data including image_url.
    
    Used to ENRICH itinerary results from JamAI with full data.
    JamAI only returns place names - we need to look up images, addresses, etc.
    
    Args:
        place_name: Name of the place (e.g., "Batu Caves")
    
    Returns:
        Full place data dict or None if not found
    """
    df = load_data()
    
    # Exact match first
    match = df[df["Name"].str.lower() == place_name.lower()]
    
    # Fuzzy match if exact fails (handles "Batu Caves" vs "Batu Caves Temple")
    if match.empty:
        match = df[df["Name"].str.lower().str.contains(place_name.lower(), na=False)]
    
    if not match.empty:
        return format_place_response(match.iloc[0])
    
    return None


def enrich_itinerary_activity(activity: Dict) -> Dict:
    """
    Enrich an itinerary activity with full place data.
    
    Args:
        activity: {"time": "09:00", "place": "Batu Caves", "type": "Tourist Spot", "reasoning": "..."}
    
    Returns:
        Activity dict with added image_url, address, etc.
    """
    place_name = activity.get("place", "")
    place_data = lookup_place_by_name(place_name)
    
    enriched = {
        "time": activity.get("time", ""),
        "place": place_name,
        "type": activity.get("type", ""),
        "reasoning": activity.get("reasoning", ""),
    }
    
    if place_data:
        enriched.update({
            "image_url": place_data.get("image_url"),
            "address": place_data.get("address"),
            "opening_hours": place_data.get("opening_hours"),
            "price_range": place_data.get("price_range"),
            "halal_status": place_data.get("halal_status"),
            "description": place_data.get("description"),
            "accessibility_info": place_data.get("accessibility_info"),
            "how_to_get_there": place_data.get("how_to_get_there"),
        })
    
    return enriched